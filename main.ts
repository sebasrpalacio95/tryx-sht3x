const I2C_ADDRESS = 0x44;
const SHT31_MEAS_HIGHREP = 0x2400;
let humidity_checksum = 0;
let len = 2;

//% color=#4c6ef5 weight=25 icon="\uf043" block="SHT3x Sensor"
namespace CipSHT3xDriver {

    pins.i2cWriteNumber(I2C_ADDRESS, SHT31_MEAS_HIGHREP, NumberFormat.UInt8BE, false);
    basic.pause(20);
    let buff = pins.i2cReadBuffer(I2C_ADDRESS, 6);

    function crc8(lsb = NumberFormat.UInt8BE, msb = NumberFormat.UInt8BE, cr = NumberFormat.UInt8LE) {
        const poly = 0x31;
        let crc = 0XFF;
        crc ^= msb;

        for (let i = 0; i < 8; i++)
            crc = crc & 0x80 ? (crc << 1) ^ 0x31 : crc << 1;

        crc ^= lsb;
        for (let i = 0; i < 8; i++)
            crc = crc & 0x80 ? (crc << 1) ^ 0x31 : crc << 1;

        if (crc == cr) {
            return true;
        }
        else {
            return false;
        }
    }
    if ((crc8(buff[0], buff[1], buff[2])) && (crc8(buff[3], buff[4], buff[5]))) {
        let temp = (buff[0] << 8) + (buff[1] << 0);
        let relHum = (buff[3] << 8) + (buff[4] << 0);
        let temperature = (temp) * 0.00267033 - 45;
        let relHumidity = (relHum) * 0.0015259;
    }

}