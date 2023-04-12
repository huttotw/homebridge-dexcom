import { PlatformAccessory, Service } from 'homebridge';

import { ExampleHomebridgePlatform } from './platform';
import { Dexcom, EGV } from './dexcom';

/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export class ExamplePlatformAccessory {
  private service: Service;
  private state: EGV;

  constructor(
    private readonly platform: ExampleHomebridgePlatform,
    private readonly accessory: PlatformAccessory,
    private readonly dexcom: Dexcom,
  ) {
    // Set accessory information
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Dexcom');

    this.state = {
      value: 100,
      trend: 'Flat',
    };

    this.service = this.accessory.getService(this.platform.config.accessoryName) ||
      this.accessory.addService(this.platform.Service.LightSensor, this.platform.config.accessoryName);

    this.platform.log.info('Added service', this.service.displayName);

    // Set the service name to the alert name
    this.service.setCharacteristic(this.platform.Characteristic.Name, 'Glucose');

    // Register handlers for this service.
    this.service.getCharacteristic(
      this.platform.Characteristic.CurrentAmbientLightLevel,
    ).onGet(() => {
      return this.state.value;
    })
      .onSet(() => {
      // You cannot set the state of this service. It is read only.
        return this.state.value;
      });


    this.updateState();
    setInterval(() => {
      this.updateState();
    }, this.platform.config.refreshInterval || 60000);
  }

  updateState() {
    this.dexcom.getLatestEGV().then((data) => {
      this.platform.log.debug('Got EGV', 'value', data.value, 'trend', data.trend);

      this.state = data;
      this.service.updateCharacteristic(this.platform.Characteristic.CurrentAmbientLightLevel, data.value);
    });
  }
}