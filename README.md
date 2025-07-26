# TO DO

- [ ] Implement API calls using the starter python code in the 'AI' folder
- [ ] Program the esp-32 according to the readme in the Cam_Setup folder
- [ ] Fill out App.js in the frontend folder to customize your website and add the appropriate communication channels (use index.js in the backend as a reference)
- [ ] Program your pico, adding functionality for any electrical components. You can edit the code on vscode and then transfer files to the pico via thonny, or you can edit the code directly on the pico using thonny.
    


# Set Up Instructions

Assumming you have already cloned the repository, you can run the project by:

1. Go to *the backend directory* and install dependencies with `npm install`
2. Add `.env` file with the contents:

```
CONNECT_URL=mqtts://INSERT_URL:INSERT_PORT
MQTT_USER=INSERT_USER
MQTT_PASS=INSERT_PASS
```
3. Add `secret.py` file with the contents:

```
API_KEY="INSERT_API_KEY"
```

4. Start the backend by running `node index.js`
5. Go to *the frontend directory* and install dependencies with `npm install`
6. Start the frontend by running `npm start`
7. Open Thonny IDE and connect Raspberry Pi Pico 2 W
8. Modify `pico/main.py` to have valid credentials (WiFi and MQTT)
9. Run `main.py`

