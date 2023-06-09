
<div align="center">

<img src="https://github.com/homebridge/branding/raw/master/logos/homebridge-wordmark-logo-vertical.png" width="200">
<br />
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Dexcom_logo.svg/2560px-Dexcom_logo.svg.png" width="200">

</div>


# Homebridge Dexcom

This plugin connects via Dexcom Share to report real time blood glucose levels disguised as an Ambient Light Sensor.

> Usage is at your own risk. Please **do not** depend on this plugin for any life saving alerts.

## Getting Started
This plugin works by using an undocumented API from Dexcom's Share app. Traditionally, this app has been used to share your real time blood glucose with friends and family.

### Setup
1. In the Dexcom iOS app, navigate to Settings > Share > Add Follower
2. Add yourself as a follower, the invite can go to the same email address that your regular Dexcom app uses.
3. Download the Dexcom Share app and accept the invitation.

Now that you are following yourself, you should be able to use your Dexcom credentials for this plugin. By default, we request new glucose values every 1 minute. You can override this behavior via `refreshInterval`.

### Example Config
```json
{
    "platforms": [
        {
            "name": "homebridge-dexcom",
            "platform": "Dexcom",
            "accessoryName": "Dexcom G6",
            "applicationId": "d89443d2-327c-4a6f-89e5-496bbb0317db",
            "username": "<username>",
            "password": "<password>"
        }
    ]
}
```
> :warning: The `applicationId` is a constant value that is required for this plugin to work.

## Known Shortcommings
- We use an Ambient Light Sensor because it's allowed values seem to encompass all possible glucose values. This is unfortunate, but it's the best thing available _I think_.
- This only works for one Dexcom device at a time. If you have a use case where you need to support multiple Dexcom devices at once, please reach out or contribute.

## Developers
Contributions are welcome! I tried to make this as vanilla as possible, it adheres almost exactly to the [Homebridge plugin template](https://github.com/homebridge/homebridge-plugin-template). Please see their guide for getting up and running locally.
