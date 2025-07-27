from machine import Pin, I2C
import ssd1306, time

i2c = I2C(1, sda=Pin(6), scl=Pin(7))

display = ssd1306.SSD1306_I2C(128, 64, i2c)

def update_display(inputStr=""):
    """
    """

    display.fill(0)
    display.show()

    if inputStr == "":
        """Update the display with the latest sensor values."""
        light = 0.853
        humidity = 55
        temperature = 70.0
        distance = 20.12495

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


# def display_message(display: ssd1306.SSD1306_I2C, inputStr: str): # limit to 9*16 = 144 characters
#     numLines = 9
#     increment = 8
#     y_val = 0
#     stringList = []

#     display.fill(0)
#     display.show()

#     for i in range(0, len(inputStr), 16):
#         stringList.append(inputStr[i : i + 16])

#     for string in stringList:
#         display.text(string, 0, y_val, 1)
#         y_val += increment

#     display.show()
    

teststr = "we have 10 people today and we will finally read out this message can you understand this message that is 144 characters now almost there there."
while True:
    update_display()
    time.sleep(1)
    update_display(teststr)
    time.sleep(1)

