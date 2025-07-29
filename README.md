# TO DO

- [ ] Make powerpoint slides
- [ ] Record presentation

**Recently Completed**

7/28:
- [X] Finish preparing parts (sanding, cutting holes)
- [X] Make parts as aesthetic as possible (laser printed line art on faces, paint, etc.)
- [X] Assemble device
- [X] Solder final circuit
- [X] Connect circuit to batteries
- [X] Test final circuit
- [X] Integrate circuit into device
- [X] Create & upload circuit schematics
- [X] Run final tests

7/27:
- [X] Test light, temperature, and humidity sensors
- [X] Program the esp-32 according to the README file in the `Cam_Setup` folder
- [X] Implement API call functionality in the `get_image_desc()` function in the `pico/main.py` file, using the starter python code in the `AI` folder
- [X] Test image capturing + AI analysis functionality
- [X] Implement distance measuring functionality in the `get_ultrasonic_value()` function in the `pico/main.py` file
- [X] Test distance sensor
- [X] Implement oled display feature (displays live data + receives messages)
- [X] Upload finalized files in `pico` folder to Pico using Thonny
- [X] Finalize hardware design (with 2-D CAD drawings)
- [X] Laser cut and 3-D print necessary parts
- [X] Assemble & test final circuit in breadboard


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

4. Create virtual server with 

```
python3 -m venv venv
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

8. Start the frontend by running 
```
npm start
```

9. Open Thonny IDE and connect Raspberry Pi Pico 2 W

10. Modify `pico/main.py` to have valid credentials (WiFi and MQTT)

11. Upload files in `pico` directory to Pico

12. Run `main.py`

