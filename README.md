## Travel Memory Application — Deployment Guide

### Project Repository: https://github.com/UnpredictablePrashant/TravelMemory

Objective: Deploy the Travel Memory application (Node.js backend + React frontend) on EC2, configure reverse proxies, scale with load balancers, and connect a custom domain via Cloudflare. This document is a professional, original walkthrough of the full deployment using the screenshots you provided.
Contents
1. Backend setup
2. Frontend setup & connection to backend
3. Scaling and Load Balancing
4. Domain setup with Cloudflare
5. Verification and Testing

### 1. Backend setup
Overview: Launch an EC2 instance (Ubuntu), install Node.js, clone the project repository, configure environment variables, install dependencies and run the backend server. Use nginx as a reverse proxy so the backend is accessible on port 80.

Key steps and commands:

 <img width="697" height="523" alt="image" src="https://github.com/user-attachments/assets/ac6fba0d-1f36-49c6-b6dd-7ba4685bdaa9" />

 <img width="768" height="279" alt="image" src="https://github.com/user-attachments/assets/c2b9d089-57a2-4344-9894-0dbc23503da1" />

 <img width="756" height="562" alt="image" src="https://github.com/user-attachments/assets/79c767cc-f93c-4ca8-83e1-1309af6d8e64" />

 <img width="774" height="404" alt="image" src="https://github.com/user-attachments/assets/7e94ca0b-26ae-4b03-9c33-2af4ffd69b66" />


Installing the Nodejs 18 and cloned the git repository of TravelMemory application.
sudo apt update
sudo -i                       # become root (or use sudo before commands)
curl -s https://deb.nodesource.com/setup_18.x | sudo bash
sudo apt install -y nodejs
cd /home/ubuntu/
sudo git clone https://github.com/UnpredictablePrashant/TravelMemory
cd TravelMemory/backend
nano .env         # add MONGO_URI and PORT (example below)
    MONGO_URI=mongodb+srv://nikithabalaji143:<db_password>@nikitha.0qzb5fk.mongodb.net/?appName=Nikitha'
    PORT=3000
sudo npm install
sudo node index.js      # starts backend on port 3000
# Make sure to whitelist the EC2 public IP in the MongoDB Atlas IP access list

 <img width="789" height="411" alt="image" src="https://github.com/user-attachments/assets/4dd0e925-f7fb-418c-b630-6cf896b8a217" />

 <img width="797" height="379" alt="image" src="https://github.com/user-attachments/assets/9da8600d-18a6-45b4-9525-5380727c8d1e" />


### 1.	Backend at Port 3000.png

<img width="900" height="355" alt="image" src="https://github.com/user-attachments/assets/59574061-8525-405f-af8c-c977fd9dee12" />
 
We need to add the IP of backend to the Mongo DB IP access list so that backend instances can communicate to database. 

<img width="900" height="503" alt="image" src="https://github.com/user-attachments/assets/dbc3d0f2-9957-4fc9-a56e-e671e9ba722c" />

### 2.	Welcome to nginx at Port 80.png

<img width="900" height="305" alt="image" src="https://github.com/user-attachments/assets/d84d59a7-4da8-4ca3-aaf6-ac6dd9854d9e" />
 
Nginx reverse proxy configuration
Create a custom nginx site file and point requests to the backend server running on port 3000. Example configuration:

server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# sudo apt install nginx
# sudo systemctl status nginx
sudo unlink /etc/nginx/sites-enabled/default
cd /etc/nginx/sites-available/
sudo nano custom_server.conf    # paste config
sudo ln -s /etc/nginx/sites-available/custom_server.conf /etc/nginx/sites-enabled/custom_server.conf
sudo service nginx configtest
sudo service nginx restart
After configuring the reverse proxy, requests to port 80 will be forwarded to the Node.js backend, making the API accessible without appending the port in the URL.
 
<img width="760" height="630" alt="image" src="https://github.com/user-attachments/assets/77607960-f647-4174-bde4-1432dd7c416a" />


### 2. Frontend setup & connection to backend
Overview: Launch a separate EC2 instance for the React frontend, update the frontend's backend URL (urls.js) to point to the backend load balancer or IP, install dependencies and start the React app. Optionally use nginx to reverse proxy the frontend app to port 80.
cd /home/ubuntu/TravelMemory/frontend
nano src/urls.js      # update API_BASE_URL or backend IP/domain
sudo npm install
sudo npm run build    # for production build (optional)
sudo npm start        # development server runs on port 3000 by default
   
<img width="900" height="667" alt="image" src="https://github.com/user-attachments/assets/5a194266-7c64-4a03-b0dc-365117acc41c" />

<img width="900" height="328" alt="image" src="https://github.com/user-attachments/assets/d8cf66aa-a23f-4463-b884-49499b525f01" />

<img width="900" height="694" alt="image" src="https://github.com/user-attachments/assets/7cfb7e05-13be-4e67-b088-04f65cae5d58" />

Update the url.js file with the backend IP address -

<img width="900" height="75" alt="image" src="https://github.com/user-attachments/assets/ed803f50-71df-4556-999f-cd970eabefd7" />


### Screenshots:
3.	Frontend compiled successfully.png

<img width="900" height="477" alt="image" src="https://github.com/user-attachments/assets/5752a2a7-d6db-4b10-84b2-00ee28b4dc14" />

4.	Add experience on Frontend IP.png

<img width="900" height="524" alt="image" src="https://github.com/user-attachments/assets/6cc47bfd-cfbd-4b45-8ef8-fbaea56f3f2d" />
 
5.	Add experience using frontend domain.png

<img width="900" height="524" alt="image" src="https://github.com/user-attachments/assets/b1056143-9c64-4e26-ae60-4fbbdbdbfdd4" />

### 3. Scaling and Load Balancing
Create AMIs from the configured frontend/backend instances, launch multiple instances from those AMIs, and configure Application Load Balancers (ALB) with Target Groups to distribute traffic across instances and across Availability Zones.
Key steps:
Create AMI from running EC2 instance (Actions > Image > Create Image)
Launch new EC2 instances using the AMI (select same security groups and subnet)
EC2 > Target Groups > Create target group (choose Instances target type)
Register instances with the target group
EC2 > Load Balancers > Create Application Load Balancer
Configure listeners (HTTP 80) and attach target groups
Ensure load balancer spans multiple AZs for high availability
AMIs Created –
      
<img width="900" height="493" alt="image" src="https://github.com/user-attachments/assets/4d48358b-c34d-4c24-828f-8c1a3ac2802d" />

<img width="900" height="466" alt="image" src="https://github.com/user-attachments/assets/8794d3a6-cea6-4bf5-bfdc-57757a24d25f" />

<img width="900" height="509" alt="image" src="https://github.com/user-attachments/assets/51537ee8-3a22-48b0-a45c-778d329b5b8d" />

<img width="900" height="462" alt="image" src="https://github.com/user-attachments/assets/85a05653-e588-4675-a018-355d751c35ca" />

<img width="900" height="467" alt="image" src="https://github.com/user-attachments/assets/f5d24454-c7bd-4fac-bcba-ff154ccd6f83" />

<img width="900" height="465" alt="image" src="https://github.com/user-attachments/assets/9b1de085-f436-4c0c-a53f-444141001471" />

<img width="900" height="289" alt="image" src="https://github.com/user-attachments/assets/eab99771-3749-4b08-9744-1bd40b43abf3" />

<img width="900" height="458" alt="image" src="https://github.com/user-attachments/assets/6e758529-76de-4efc-a6eb-bdb3699d70ac" />

<img width="900" height="461" alt="image" src="https://github.com/user-attachments/assets/7d97122b-acad-48cb-820e-a6959f5acf90" />


### Screenshots (ALB & Target Groups):
6.	ALB Backend Creation1.png

<img width="900" height="400" alt="image" src="https://github.com/user-attachments/assets/97dd7162-6ee9-4aea-96f9-eebc8e391403" />

7.	ALB Backend Creation2.png

<img width="900" height="410" alt="image" src="https://github.com/user-attachments/assets/44bbe81d-a4b3-4b70-9f93-4c8ebc04f2a8" />

8.	ALB Backend Creation3.png

<img width="900" height="471" alt="image" src="https://github.com/user-attachments/assets/d490b9cf-4513-4a6e-863c-fbfb9aabf2e4" />

9.	ALB Backend Creation4.png

<img width="900" height="345" alt="image" src="https://github.com/user-attachments/assets/4cfc98f8-42f3-4fd7-a179-0b53cc24270f" />

10.	ALB Backend Creation5.png

<img width="900" height="492" alt="image" src="https://github.com/user-attachments/assets/375a8175-71a3-476e-bdb7-369182f05539" />


### Active Load Balancers – 
 
<img width="900" height="244" alt="image" src="https://github.com/user-attachments/assets/de4036a3-4e47-44da-b0ff-d95aa39af58b" />

### 4. Domain setup with Cloudflare
Overview: Point a custom domain (example used: adarshkumars.co.in) to the frontend load balancer using a CNAME record in Cloudflare. Create a subdomain for the backend (e.g., back.adarshkumars.co.in) and map it to the backend load balancer or backend instances. Update the frontend's urls.js to use the backend subdomain for API calls.
Typical Cloudflare DNS entries:
A record: subdomain (or root) -> EC2 public IP (if pointing directly to instance)
CNAME: subdomain -> frontend-load-balancer-endpoint.amazonaws.com
Ensure SSL/TLS is configured in Cloudflare (Flexible/Full as required)
Wait for DNS propagation and test the domain in a browser
 
<img width="900" height="246" alt="image" src="https://github.com/user-attachments/assets/d140a801-f5c8-44b2-9586-fd5a4a1e989f" />

### Screenshots (Domain & DB verification):
11.	Add experience using frontend domain.png

<img width="900" height="524" alt="image" src="https://github.com/user-attachments/assets/55aa99b4-1bf4-44fa-a1b3-4462c3c48218" />
 
12.	TripDetails in Mongodb.png

<img width="900" height="473" alt="image" src="https://github.com/user-attachments/assets/a5b02a98-b282-49b0-8ebe-d3f7eae76f10" />

### 5. Verification and Testing
After deployment, verify:
Frontend loads via the domain (or load balancer) and allows adding experiences
Backend APIs respond correctly and persist data to MongoDB Atlas
Multiple instances behind ALB show healthy targets in Target Groups
DNS resolves to the load balancer and SSL is valid (if configured)

Sample evidence (screenshots included above):
 - Frontend UI with 'Add experience' screens
 - MongoDB showing TripDetails records

