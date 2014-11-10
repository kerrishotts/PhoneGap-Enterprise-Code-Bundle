#!/bin/bash
echo "Opening tunnels..."
pid=`ps -eaf | grep pge-tunnel | grep ssh | cut -d " "  -f 4`
if [ "$pid" != "" ]
then
  echo $pid | xargs kill -9
fi
ssh -N pge-tunnel &
echo "Tunnels open."
