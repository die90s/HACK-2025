from machine import Pin, ADC, I2C
import dht, time, utime, ssd1306
from time import sleep
from connections import connect_mqtt, connect_internet

requests = None # global variable to keep track of requests

photo_ADC = ADC(Pin(26)) # can change this value for different adc pins
dht11 = dht.DHT11(Pin(2)) # any io pin
triggerpin = Pin(3, Pin.OUT) # any io pin
echopin = Pin(4, Pin.IN) # any io pin
i2c = I2C(1, sda=Pin(6), scl=Pin(7)) # needs to be sda and scl i2c pins
display = ssd1306.SSD1306_I2C(128, 64, i2c)

# temp and humidity constants
CONST_DIFF_TEMP = 77-71
CONST_DIFF_HUMIDITY = 52-61

# adc light constants
MAX_ADC_PHOTO = 65000
ADC_RANGE_PHOTO = MAX_ADC_PHOTO - 1200 # dont change

def update_display(inputStr=""):
    """
    Updates display with temp, humidity, light, and distance.
    Optional parameter to display 144 character string instead.
    """

    display.fill(0)
    display.show()

    if inputStr == "":
        """Update the display with the latest sensor values."""
        light = get_light_value(photo_ADC)
        humidity = get_humidity_value(dht11)
        temperature = get_temperature_value(dht11)
        distance = get_ultrasonic_value(triggerpin, echopin)

        display.text(f"light: {light:.02f} lm", 0, 0, 1)
        display.text(f"hum: {humidity:.02f}%", 0, 10, 1)
        display.text(f"temp: {temperature:.02f} F", 0, 20, 1)
        display.text(f"dist: {distance:.02f} cm", 0, 30, 1)

        display.show()
            
    else:
        numLines = 9
        increment = 8
        y_val = 0
        stringList = []

        display.fill(0)
        display.show()

        for i in range(0, len(inputStr), 16):
            stringList.append(inputStr[i : i + 16])

        for string in stringList:
            display.text(string, 0, y_val, 1)
            y_val += increment

            display.show()
            time.sleep(10)

def get_light_value(photo_ADC_pin: ADC):
    """
    Gets adc value from photoresistor, returns a float for the lumens.
    Assuming to use a 3k ohm resistor in series with the photoresistor
    for the voltage divider. ADC measures voltage relative to ground
    across photoresistor.

    *** prints adc val for now for adjusting of values ***

    Args:

    Returns:
        float: the value of luminosity in lumens
    """
    
    adc_val = photo_ADC_pin.read_u16()

    lumens = (-adc_val + MAX_ADC_PHOTO)/(ADC_RANGE_PHOTO)

    return lumens

def get_humidity_value(dhtpin: dht):
    """Get the current humidity value from the DHT11 sensor.

    Returns:
        int: The current humidity value.
    """

    dht11.measure()
    humidity = dht11.humidity() - CONST_DIFF_HUMIDITY

    return humidity

def get_temperature_value(dhtpin: dht):
    """Get the current temperature value from the DHT11 sensor.

    Returns:
        float: The current temperature value.
    """

    dht11.measure()
    temp_C = dht11.temperature()
    temp_F = temp_C * 9/5 + 32 - CONST_DIFF_TEMP

    return temp_F

def get_ultrasonic_value(trigger: Pin, echo: Pin):
    """
    Gets the distance from the HC-SR04 in cm.

    Args:
        trigger (Pin): Should be set to Pin.OUT and the same IO pin attached to trigger
        echo (Pin): Set to Pin.IN and the same IO pin connected to echo

    Returns:
        float: In cms of distance from the ultrasonic sensor
    """

    trigger.low()
    utime.sleep_us(2)   
    trigger.high()
    utime.sleep_us(5)
    trigger.low

    while echo.value() == 0:
        signaloff = utime.ticks_us()
        
    while echo.value() == 1:
       signalon = utime.ticks_us()

    timepassed = signalon - signaloff
    distance = (timepassed * 0.0343) / 2

    return distance


# The following function is a callback function that handles all messages published to the Pico's subscribed topics
def handle_message(topic, msg):
    global requests
    
    if   topic == b'request-light':
        requests['light'] += 1

    if topic == b'request-humidity':
        requests['humidity'] += 1
        
    if topic == b'request-temp':
        requests['temp'] += 1
 
    if topic == b'request-ultrasonic':
        requests['ultrasonic'] += 1

    if topic == b'text':
        inputStr = msg.decode('utf-8')
        print("Received text: ", inputStr)
        update_display(inputStr)



# The following function is the main function that connects to Wi-Fi and MQTT broker, 
# subscribes to topics, and iteratively keeps checking for new messages in subscribed topics, 
# and handles them accordingly (using the handle_message function defined above)
def main():
    try:
        # connect to Wi-Fi and MQTT broker
        connect_internet("HAcK-Project-WiFi-1", password="UCLA.HAcK.2024.Summer")  # SSID and password

        client = connect_mqtt(
            "a1cb083513d9469b91404a586179490c.s1.eu.hivemq.cloud",
            "die90s",
            "Die90s!02"
        )
        
        global requests
        
        requests = {
            'light': 0,
            'temp': 0,
            'humidity': 0,
            'ultrasonic': 0,
            'text': 0
        }
        
        # Set the message callback handler
        client.set_callback(handle_message)

        # subscribe to necessary topics
        client.subscribe("request-light")
        client.subscribe("request-humidity")
        client.subscribe("request-temp")
        client.subscribe("request-ultrasonic")
        client.subscribe("text")

        # keep checking for new messages in subscribed topics
        while True:

            client.check_msg()

            sleep(0.1)

            if requests['light'] > 0:
                print("pico received light request")
                client.publish("light", f(get_light_value(photo_ADC)))
                print("published light request")
                requests['light'] -= 1
            if requests['humidity'] > 0:
                print("pico received humidity request")
                client.publish("humidity", str(get_humidity_value(dht11)))
                print("published humidity request")
                requests['humidity'] -= 1
            if requests['temp'] > 0:
                print("pico received temp request")
                client.publish("temp", str(get_temperature_value(dht11)))
                print("published temp request with value: ", get_temperature_value(dht11))
                requests['temp'] -= 1
            if requests['ultrasonic'] > 0:
                print("pico received ultrasonic request")
                client.publish("ultrasonic", str(get_ultrasonic_value(triggerpin, echopin)))
                print("published ultrasonic request")
                requests['ultrasonic'] -= 1

            update_display()


    except KeyboardInterrupt:
        print('Keyboard interrupt')

if __name__ == "__main__":
    main()