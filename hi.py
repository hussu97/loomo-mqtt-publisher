import math
tx = -57
n = 2
def distance(rssi):
    print((tx-rssi)/10*2)
    return pow(10,(tx-rssi)/10*2)
print(distance(-36))
print(distance(-50))
print(distance(-35))
print(distance(-57))
