# Setup for Tasker Application Server (pge-as)

First, create a droplet on Digital Ocean using CentOS 6.5 64-bit. Assign your SSH key so that you can log in without a password. Also ensure that Virtual Networking is checked.

Add the IP address you receive to your `/etc/hosts` file:

    192.168.100.145   pge-as pge-as.acmecorp.com

## Initial Server Setup

Based in part on <https://www.digitalocean.com/community/tutorials/initial-server-setup-with-centos-6> and <https://www.digitalocean.com/community/tutorials/how-to-compile-node-js-with-npm-from-source-on-centos-6>.

1. SSH to your server: `ssh root@pge-as`
2. Change `root`'s password: `passwd`
3. Install some basics:
	```
	yum install man bc xauth wget gcc gcc-c++ automake autoconf libtoolize make git
	``` 
4. Add the `taskeradmin` group: `groupadd taskeradmin`
5. Add the `tasker` user: `useradd -G taskeradmin tasker`
6. Assign a password to `tasker`: `passwd tasker`
7. Allow `tasker` to `sudo`: `visudo`
8. Find the line that looks like this: `root    ALL=(ALL)       ALL` and add a new line below it:
	```
	tasker    ALL=(ALL)       ALL
	``` 
9. Configure SSH: `vi /etc/ssh/sshd_config`
10. Change the port number by searching for `Port`, uncommenting the line (if necessary). I use `52200`.
11. Search for `HostKey` and enable (uncomment) `ssh_host_rsa_key`, `ssh_host_dsa_key` and `ssh_host_key`.
12. Search for `Protocol` and ensure `2` is the setting.
13. Search for `PermitRootLogin` and set to `no` (uncomment if necessary)
14. Search for `UseDNS` and set to `no` (uncomment if necessary)
15. Search for `UsePAM` and set to `no` (uncomment if necessary)
16. Search for `PasswordAuthentication` and set to `no` (uncomment if necessary)
17. Search for `ChallengeResponseAuthentication` and set to `no` (uncomment if necessary)
18. Add the following to the bottom of the file:
	```
	AllowUsers tasker
	``` 
19. Save and quit.
20. Reload SSH:
	```
	/etc/init.d/sshd reload
	``` 
21. Test: open a *new* session (don't close your old one) and verify that you can log in with the new account:
	```
	ssh -p 52200 tasker@pge-as
	``` 
22. As `tasker`, add your SSH key so that you can login without a password:
	```
	mkdir ssh
	vi authorized_keys
	(paste in your public key)
	(save and quit)
	``` 
23. Ensure proper permissions:
	```
	chmod 600 ~/.ssh/authorized_keys
	chomd 700 ~/.ssh
	``` 
24. `exit` and verify you can login to `tasker` without a password.
25. As `tasker`, verify that you can `sudo sh`.
26. Exit your `root` session. Attempt to log back in to verify that `root` is no longer useable.

## Set up the firewall

Log in as `tasker` and `sudo sh`. Then:

```
iptables -A INPUT -m state --state RELATED,ESTABLISHED -j ACCEPT
iptables -A INPUT -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT
iptables -A INPUT -p tcp -m tcp --tcp-flags FIN,SYN,RST,PSH,ACK,URG NONE -j DROP
iptables -A INPUT -p tcp -m tcp ! --tcp-flags FIN,SYN,RST,ACK SYN -m state --state NEW -j DROP
iptables -A INPUT -p tcp -m tcp --tcp-flags FIN,SYN,RST,PSH,ACK,URG FIN,SYN,RST,PSH,ACK,URG -j DROP
iptables -A INPUT -i lo -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 8000 -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 52200 -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 52300 -j ACCEPT
iptables -P OUTPUT ACCEPT
iptables -P INPUT DROP
iptables-save | sudo tee /etc/sysconfig/iptables
service iptables restart
```
    
## Configure `/etc/hosts`

As `tasker`, `sudo vi /etc/hosts` and add the following line:

    pge-db-internal-ip-address   pge-db pge-db pge-db.acmecorp.com
    
On `pge-db`, make sure `/etc/hosts` contains `pge-as`'s internal IP address, and iptables has the following rule:

    iptables -I INPUT 1 -i eth1 -s pge-as -j ACCEPT
    
## Ensure pge-as port-forwards SSH and SQL to pge-db:

```
ssh -L 52201:pge-db:52200 -L 40000:pge-db:52300 -N -p 52200 tasker@pge-as &
```

Suggest setting up a local `~/.ssh/config`:

```    
Host pge-as
		HostName pge-as
		Port 52200
		User tasker
		IdentitiesOnly yes
		Compression yes
		ForwardX11 yes

Host pge-db
		HostName localhost
		Port 52201
		User oracle
		IdentitiesOnly yes
		Compression yes
		ForwardX11 yes

Host pge-tunnel
		HostName pge-as
		Port 52200
		User tasker
		IdentitiesOnly yes
		Compression yes
		LocalForward 52201 pge-db:52200
		LocalForward 40000 pge-db:52300
```

Then, to SSH to pge-db or connect via SQL:

    ssh -N pge-tunnel &
    ssh pge-db

## Install Node

Based on part from <https://www.digitalocean.com/community/tutorials/how-to-compile-node-js-with-npm-from-source-on-centos-6>

1. Change to the `/opt` directory and download the latest version of Node: `wget http://nodejs.org/dist/node-latest.tar.gz`
2. Untar the file: `tar xzvf node-latest.tar.gz`
3. Change to the newly extracted directory (`cd node-v*`)
4. Configure: `./configure`
5. Build from source: `make`; wait a while...
6. When done, install: `make install`
7. Verify node is installed: `node --version` and `npm --version`
8. In order to use `node` or `npm` with `sudo`, `visudo` and add `/usr/local/bin` to the `Defaults secure_path=...`
9. Install `n`: `npm install -g n`
10. To update, you can use `sudo n stable`

## Install Oracle Instant Client

In order for us to use Node.js and Oracle, we need to install the Oracle Instant Client. The following is based on instructions at <https://github.com/joeferner/node-oracle/blob/master/INSTALL.md>.

1. Download the Oracle Instant Client for your machine from <http://www.oracle.com/technetwork/database/features/instant-client/index-097480.html>. Download either the Basic or Basic Lite package as well as the SDK package. Ensure that you select the proper architecture for your system.
2. As `tasker`:
	```
	sudo rpm -ivh oracle-instantclient12.1-basic-12.1.0.1.0-1.x86_64.rpm
	sudo rpm -ivh oracle-instantclient12.1-devel-12.1.0.1.0-1.x86_64.rpm
	``` 
3. Link libraries (may already exist) (in `/usr/lib/oracle/12.1/client64/lib`):
	```
	ln -s libclntsh.so.12.1 libclntsh.so
	ln -s libocci.so.12.1 libocci.so
	``` 
4. Add the shared objects to the ld cache:
	```
	echo '/usr/lib/oracle/12.1/client64/lib/' | sudo tee -a /etc/ld.so.conf.d/oracle_instant_client.conf
	sudo ldconfig
	``` 
5. Set up `.bash_profile` for `tasker` to point to Oracle Instant Client:
	```
	export OCI_HOME=/usr/lib/oracle/12.1/client64/lib
	export OCI_LIB_DIR=$OCI_HOME
	export OCI_INCLUDE_DIR=$OCI_HOME/sdk/include
	export OCI_VERSION=12
	export NLS_LANG=AMERICAN_AMERICA.UTF8
	``` 
6. 	





