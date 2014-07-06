# Setup for Tasker Database Server (pge-db)

First, create a droplet on Digital Ocean using CentOS 6.5 64-bit. Assign your SSH key so that you can log in without a password. Also ensure that Virtual Networking is checked.

Add the IP address you receive to your `/etc/hosts` file:

    192.168.100.146   pge-db pge-db.acmecorp.com

## Initial Server Setup

Based in part on <https://www.digitalocean.com/community/tutorials/initial-server-setup-with-centos-6> and <https://www.digitalocean.com/community/tutorials/how-to-compile-node-js-with-npm-from-source-on-centos-6>.

1. SSH to your server: `ssh root@pge-db`
2. Change `root`'s password: `passwd`
3. Install some basics:
	```
	yum install man bc xauth wget gcc gcc-c++ automake autoconf libtoolize make
	``` 
4. Add the `dba` group: `groupadd dba`
5. Add the `oinstall` group: `groupadd oinstall`
6. Add the `oracle` user: `useradd -g dba -G oinstall oracle`
7. Assign a password to `oracle`: `passwd oracle`
8. Allow `oracle` to `sudo`: `visudo`
9. Find the line that looks like this: `root    ALL=(ALL)       ALL` and add a new line below it:
	```
	oracle     ALL=(ALL)       ALL
	``` 
10. Configure SSH: `vi /etc/ssh/sshd_config`
11. Change the port number by searching for `Port`, uncommenting the line (if necessary). I use `52200`.
12. Search for `HostKey` and enable (uncomment) `ssh_host_rsa_key`, `ssh_host_dsa_key` and `ssh_host_key`.
13. Search for `Protocol` and ensure `2` is the setting.
14. Search for `PermitRootLogin` and set to `no` (uncomment if necessary)
15. Search for `UseDNS` and set to `no` (uncomment if necessary)
16. Search for `UsePAM` and set to `no` (uncomment if necessary)
17. Search for `PasswordAuthentication` and set to `no` (uncomment if necessary)
18. Search for `ChallengeResponseAuthentication` and set to `no` (uncomment if necessary)
19. Add the following to the bottom of the file:
	```
	AllowUsers oracle
	``` 
20. Save and quit.
21. Reload SSH:
	```
	/etc/init.d/sshd reload
	``` 
22. Test: open a *new* session (don't close your old one) and verify that you can log in with the new account:
	```
	ssh -p 52200 oracle@pge-db
	``` 
23. As `oracle`, add your SSH key so that you can login without a password:
	```
	mkdir ssh
	vi authorized_keys
	(paste in your public key)
	(save and quit)
	``` 
24. Ensure proper permissions:
	```
	chmod 600 ~/.ssh/authorized_keys
	chmod 700 ~/.ssh
	``` 
25. `exit` and verify you can login to `oracle` without a password.
26. As `oracle`, verify that you can `sudo sh`.
27. Exit your `root` session. Attempt to log back in to verify that `root` is no longer useable.

## Set up the firewall

Log in as `oracle` and `sudo bash`. Then:

```
iptables -A INPUT -m state --state RELATED,ESTABLISHED -j ACCEPT
iptables -A INPUT -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT
iptables -A INPUT -p tcp -m tcp --tcp-flags FIN,SYN,RST,PSH,ACK,URG NONE -j DROP
iptables -A INPUT -p tcp -m tcp ! --tcp-flags FIN,SYN,RST,ACK SYN -m state --state NEW -j DROP
iptables -A INPUT -p tcp -m tcp --tcp-flags FIN,SYN,RST,PSH,ACK,URG FIN,SYN,RST,PSH,ACK,URG -j DROP
iptables -A INPUT -i lo -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 52200 -j ACCEPT
iptables -P OUTPUT ACCEPT
iptables -P INPUT DROP
iptables-save | sudo tee /etc/sysconfig/iptables
service iptables restart
```
    
## Set up a swap file

`sudo` to `root`:

    dd if=/dev/zero of=/swapfile bs=1024 count=2048k
    mkswap /swapfile
    swapon /swapfile
    chown root:root /swapfile
    chmod 0600 /swapfile
    sysctl vm.swappiness=30
    vi /etc/sysctl.conf
    # Add or alter vm.swappiness to 30
    vm.swappiness=30
    :wq
    vi /etc/fstab
    /swapfile          swap            swap    defaults        0 0
    :wq
    

## Set up Oracle 11g XE

As `oracle`, Download Oracle from <http://www.oracle.com/technetwork/database/database-technologies/express-edition/downloads/index.html> and save it to the server. Unzip the file and `cd Disk1`.

    unzip oracle-xe-11.2.0-1.0.x86_64.rpm.zip
    cd Disk1
    sudo rpm -ivh oracle-xe-11.2.0-1.0.x86_64.rpm
    sudo /etc/init.d/oracle-xe configure
    (You'll be prompted for Oracle account passwords and a port number for Application express.
     For the latter I used 8080. You'll also be prompted for a listener port -- the default is
     1521. It's better to use a nonstandard port. I used 52300.)
    cp /u01/app/oracle/product/11.2.0/xe/bin/oracle_env.sh ~/oraenv.sh
    
To set up your Oracle Environment, you can:

    . ~/oraenv.sh
    
## After PGE-AS is set up

1. Modify `/etc/hosts` to include the *internal* IP address:
	```
	10.1.222.198  pge-as pge-as pge-as.acmecorp.com
	```

2. Modify the firewall to allow all access from `pge-as` and remove SSH access directly ( SSH is now only allowed over a tunneled port from `pge-as`) :
	```   
	iptables -I INPUT 1 -i eth1 -s pge-as -j ACCEPT    
	iptables -D INPUT 8
	```

