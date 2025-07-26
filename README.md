# TO DO

- [ ] Test light, temperature, and humidity sensors
- [ ] Program the esp-32 according to the README file in the `Cam_Setup` folder
- [ ] Implement API call functionality in the `get_image_desc()` function in the `pico/main.py` file, using the starter python code in the `AI` folder
- [ ] Test image capturing + AI analysis functionality
- [ ] Implement distance measuring functionality in the `get_ultrasonic_value()` function in the `pico/main.py` file
- [ ] Test distance sensor
- [ ] Upload finalized files in `pico` folder to Pico using Thonny
- [ ] Finalize hardware design (with 2-D CAD drawings)
- [ ] Laser cut and 3-D print necessary parts
- [ ] Assemble device
- [ ] Create & upload circuit schematics 
- [ ] Assemble final circuit in breadboard
- [ ] Solder final circuit
- [ ] Connect circuit to battery and Pico
- [ ] Run final tests
    


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

