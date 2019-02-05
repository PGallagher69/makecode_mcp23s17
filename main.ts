enum Registers_Bank0 {
    //% register=IODirectionA
    IODIRA = 0x00,
    //% register=IODirectionB
    IODIRB = 0x01,
    //% register=IOPolarityA
    IOPOLA = 0x02,
    //% register=IOPolarityB
    IOPOLB = 0x03,
    //% register=GPIOInteruptA
    GPINTENA = 0x04,
    //% register=GPIOInteruptB
    GPINTENB = 0x05,
    //% register=DefaultValueA
    DEFVALA = 0x06,
    //% register=DefaultValueA
    DEFVALB = 0x07,
    //% register=InteruptControlA
    INTCONA = 0x08,
    //% register=InteruptControlB
    INTCONB = 0x09,
    //% register=IOControlA
    IOCONA = 0x0A,
    //% register=IOControlB
    IOCONB = 0x0B,
    //% register=GPIOPullUpA
    GPPUA = 0x0C,
    //% register=GPIOPullUpB
    GPPUB = 0x0D,
    //% register=InteruptFlagsA
    INTFA = 0x0E,
    //% register=InteruptFlagsB
    INTFB = 0x0F,
    //% register=InteruptCapturedA
    INTCAPA = 0x10,
    //% register=InteruptCapturedB
    INTCAPB = 0x11,
    //% register=GPIOValuesA
    GPIOA = 0x12,
    //% register=GPIOValuesB
    GPIOB = 0x13,
    //% register=GPIOOutputLatchA
    OLATA = 0x14,
    //% register=GPIOOutputLatchB
    OLATB = 0x15
}

enum Registers_Bank1 {
    //% register=IODirectionA
    IODIRA = 0x00,
    //% register=IOPolarityA
    IOPOLA = 0x01,
    //% register=GPIOInteruptA
    GPINTENA = 0x02,
    //% register=DefaultValueA
    DEFVALA = 0x03,
    //% register=InteruptControlA
    INTCONA = 0x04,
    //% register=IOControlA
    IOCONA = 0x05,
    //% register=GPIOPullUpA
    GPPUA = 0x06,
    //% register=InteruptFlagsA
    INTFA = 0x07,
    //% register=InteruptCapturedA
    INTCAPA = 0x08,
    //% register=GPIOValuesA
    GPIOA = 0x09,
    //% register=GPIOOutputLatchA
    OLATA = 0x0A,

    //% register=IODirectionB
    IODIRB = 0x0B,
    //% register=IOPolarityB
    IOPOLB = 0x0C,
    //% register=GPIOInteruptB
    GPINTENB = 0x0D,
    //% register=DefaultValueA
    DEFVALB = 0x0E,
    //% register=InteruptControlB
    INTCONB = 0x0F,
    //% register=IOControlB
    IOCONB = 0x10,
    //% register=GPIOPullUpB
    GPPUB = 0x11,
    //% register=InteruptFlagsB
    INTFB = 0x12,
    //% register=InteruptCapturedB
    INTCAPB = 0x13,
    //% register=GPIOValuesB
    GPIOB = 0x14,
    //% register=GPIOOutputLatchB
    OLATB = 0x15
}

let OpCode_W = 64
let OpCode_R = 65

//% color=#ED2522 weight=100 icon="\uf2db" block="MCP23S17"
namespace mcp23s17 {

    /**
     * GPIO Banks
     */
    export enum Banks {
        BankA = 0x01,
        BankB = 0x02,
        Both = 0x03
    }

    /**
     * GPIO Pin Numbers
     */
    export enum PinNos {
        Pin1 = 0x01,
        Pin2 = 0x02,
        Pin3 = 0x03,
        Pin4 = 0x04,
        Pin5 = 0x05,
        Pin6 = 0x06,
        Pin7 = 0x07,
        Pin8 = 0x08,
        Pin9 = 0x09,
        Pin10 = 0x0A,
        Pin11 = 0x0B,
        Pin12 = 0x0C,
        Pin13 = 0x0D,
        Pin14 = 0x0E,
        Pin15 = 0x0F,
        Pin16 = 0x10
    }

    /**
     * GPIO Pin Values
     */
    export enum PinValues {
        High = 0x01,
        Low = 0x00
    }

    /**
     *
     * Initialise the MCP23S17 Chip to PJG Creations Defaults
     * 
    */
    //% blockId=initialise_mcp block="Initialise MCP with a Chip Select connected to %chipselect|with an Address of %address"
    //% @param chipselect which pin the Chip Select Line is connected to
    //% @param address what address the Chip is wired to
    export function InitialiseMCP(chipselect: DigitalPin, address: number) {

        pins.spiFrequency(1000000)

        SetupAddressMode(chipselect, address)
        SetAllBankAIOToInput(chipselect, address)
        SetAllBankBIOToInput(chipselect, address)
        SetAllBankAInputPullUpOn(chipselect, address)
        SetAllBankBInputPullUpOn(chipselect, address)

    }

    // Write to one of the MCP23S17 Registers
    // Set Address Register and Value before Calling
    function WriteRegister(chipselect: DigitalPin, address: number, Register: Registers_Bank0, Value: number) {
        pins.digitalWritePin(chipselect, 0)
        let _command = OpCode_W | (address << 1)
        let _result = pins.spiWrite(_command)
        _result = pins.spiWrite(Register)
        _result = pins.spiWrite(Value)
        pins.digitalWritePin(chipselect, 1)
        return _result
    }

    // Read from one of the MCP23S17 Registers
    // Set Address Register and Value before Calling
    // Result returned in the Result Variable
    function ReadRegister(ChipSelect: DigitalPin, Address: number, Register: Registers_Bank0) {
        pins.digitalWritePin(ChipSelect, 0)
        let _command = OpCode_R | (Address << 1)
        let _result = pins.spiWrite(_command)
        _result = pins.spiWrite(Register)
        _result = pins.spiWrite(0)
        pins.digitalWritePin(ChipSelect, 1)
        return _result
    }

    // 
    // Setup the Address Mode
    //
    function SetupAddressMode(ChipSelect: DigitalPin, Address: number) {
        // SEQOP = Disabled HAEN = Enabled = 40d / 28h
        let _result = WriteRegister(ChipSelect, Address, Registers_Bank0.IOCONA, 40)
    }

    //
    // Set all the Bank A IO Pins to Input
    //
    function SetAllBankAIOToInput(ChipSelect: DigitalPin, Address: number) {
        let _result = WriteRegister(ChipSelect, Address, Registers_Bank0.IODIRA, 255)
    }

    //
    // Set all the Bank B IO Pins to Input
    //
    function SetAllBankBIOToInput(ChipSelect: DigitalPin, Address: number) {
        let _result = WriteRegister(ChipSelect, Address, Registers_Bank0.IODIRB, 255)
    }

    //
    // Set all the Bank A IO Pins to Pull Up
    //
    function SetAllBankAInputPullUpOn(ChipSelect: DigitalPin, Address: number) {
        let _result = WriteRegister(ChipSelect, Address, Registers_Bank0.GPPUA, 255)
    }

    //
    // Set all the Bank B IO Pins to Pull Up
    //
    function SetAllBankBInputPullUpOn(ChipSelect: DigitalPin, Address: number) {
        let _result = WriteRegister(ChipSelect, Address, Registers_Bank0.GPPUB, 255)
    }

    /**
     * Read a GPIO Pin
     */
    //% blockId=read_gpio_pin block="Read GPIO %pinno|of MCP with a Chip Select on %chipselect|with an Address of %address"
    //% @param pinno which Bank(s) to read
    //% @param chipselect which pin the Chip Select Line is connected to
    //% @param address what address the Chip is wired to
    export function ReadGPIOPin(pinno: PinNos, chipselect: DigitalPin, address: number): PinValues {

        let _GPIOValues = ReadGPIO(Banks.Both, chipselect, address)
        let _PinValue = (1 << (pinno - 1)) ? PinValues.Low : PinValues.High;
        return _PinValue
    }

    /**
     *
     * Read the GPIO Pins
     * 
    */
    //% blockId=read_gpio block="Read Bank %bank|of MCP with a Chip Select on %chipselect|with an Address of %address"
    //% @param Bank which Bank(s) to read
    //% @param ChipSelect which pin the Chip Select Line is connected to
    //% @param Address what address the Chip is wired to
    export function ReadGPIO(bank: Banks, ChipSelect: DigitalPin, Address: number): number {

        switch (bank) {
            case Banks.BankA:

                return ReadBankA(ChipSelect, Address)
                break;

            case Banks.BankB:

                return ReadBankB(ChipSelect, Address)
                break;

            case Banks.Both:

                let _bankAValue = ReadBankA(ChipSelect, Address)
                let _bankBValue = ReadBankB(ChipSelect, Address) << 8
                return _bankAValue | _bankBValue

                break;

        }

    }

    /**
     *
     * Read the Bank A Register
     * 
    */
    //% blockId=read_bank_a block="Read Bank A of MCP with a Chip Select on %chipselect|with an Address of %address"
    //% @param ChipSelect which pin the Chip Select Line is connected to
    //% @param Address what address the Chip is wired to
    function ReadBankA(ChipSelect: DigitalPin, Address: number): number {
        let _result = ReadRegister(ChipSelect, Address, Registers_Bank0.GPIOA)
        return _result
    }

    /**
     *
     * Read the Bank B Register
     * 
    */
    //% blockId=read_bank_b block="Read Bank B of MCP with a Chip Select on %chipselect|with an Address of %address"
    //% @param ChipSelect which pin the Chip Select Line is connected to
    //% @param Address what address the Chip is wired to
    function ReadBankB(ChipSelect: DigitalPin, Address: number): number {
        let _result = ReadRegister(ChipSelect, Address, Registers_Bank0.GPIOB)
        return _result
    }
}

