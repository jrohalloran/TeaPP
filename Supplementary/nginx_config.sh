server {
        proxy_read_timeout 30000;
        proxy_connect_timeout 3600s;
        proxy_send_timeout 30000s;
        client_max_body_size 20G;
  listen 80;
  server_name _;

  root /home/ubuntu/Thesis/TPP_Visualisation/tpp_vis_app/dist/tpp_vis_app/browser;
  index index.html;
        auth_basic "Restricted Content";
        auth_basic_user_file /etc/nginx/.htpasswd;

  # Serve Angular frontend
  location / {
    try_files $uri $uri/ /index.html;
        #auth_basic "Restricted Content";
        #auth_basic_user_file /etc/nginx/.htpasswd;
  }

  # API endpoints
  location /api/ {
    proxy_pass http://localhost:3333/api/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Remote-User $remote_user;
  }

  # Static image routes
  location /kinshipImages/ {
    proxy_pass http://localhost:3333/kinshipImages/;
  }

  location /calculatedKinship/ {
    proxy_pass http://localhost:3333/calculatedKinship/;
  }

  location /fastQCReports/ {
    proxy_pass http://localhost:3333/fastQCReports/;
  }

  location /diagramImages/ {
    proxy_pass http://localhost:3333/diagramImages/;
  }

  location /rainfallImages/ {
    proxy_pass http://localhost:3333/rainfallImages/;
  }

  location /temperatureImages/ {
    proxy_pass http://localhost:3333/temperatureImages/;
  }

  # File upload routes
  location /uploadFile {
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
        client_max_body_size 100M;
    proxy_pass http://localhost:3333/uploadFile;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }

  location /uploadEnvRAINFile {
    proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
        client_max_body_size 100M;
        proxy_pass http://localhost:3333/uploadEnvRAINFile;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }

  location /uploadEnvTEMPFile {
    proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
        client_max_body_size 100M;
        proxy_pass http://localhost:3333/uploadEnvTEMPFile;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }

  location /uploadGENOMFile {
    client_max_body_size 20G;
    proxy_read_timeout 300;
    proxy_connect_timeout 300;
    proxy_send_timeout 300;

    proxy_pass http://localhost:3333/uploadGENOMfile;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;

  }

}