# Set Up Instructions

Assumming you have already cloned the repository, you can run the project by:

1. Go to *the backend directory* and install dependencies with `npm install`

2. Add `.env` file with the contents:

```
CONNECT_URL=mqtts://INSERT_URL:INSERT_PORT
MQTT_USER=INSERT_USER
MQTT_PASS=INSERT_PASS
```
3. Add `secrets.py` file with the contents:

```
API_KEY="INSERT_API_KEY"
```

4. Create and activate virtual server with 

```
python3 -m venv venv
source venv/bin/activate
```

5. Install dependencies (in requirements.txt) with 

```
pip install requests openai python-dotenv
```

6. Start the backend by running
```
node index.js
```

7. Go to *the frontend directory* and install dependencies with 
```
npm install
```

8. In `frontend/src/App.js` change the host name in `IMAGE_URL` constant to the one that corresponds to the ESP camera. 

9. Start the frontend by running 
```
npm start
```

10. Open Thonny IDE and connect Raspberry Pi Pico 2 W

11. Modify `pico/main.py` to have valid credentials (WiFi and MQTT)

12. Upload files in `pico` directory to Pico

13. Run `main.py` from computer, or connect pico to external battery


