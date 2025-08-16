#! /bin/bash
### check path version if not changed! !
echo "fixing path"
export PATH=$PATH:/root/.nvm/versions/node/v22.18.0/bin/
cd /opt/userManagerCloud/backend/ && . /root/envs.sh && npm start &
cd /opt/userManagerCloud/frontend/ && . /root/envs.sh && npm run build && serve -s build -p 3000 &
