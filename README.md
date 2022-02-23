# Needle JSON

Figma plugin that modifies layers based on the provided JSON configuration. Needle's idea is to "pierce" the layers and apply an action depending on the configuration of the JSON file

Supported actions:

- Setting frame name
- Switching variant
- Toggling layer's visibility
- Changing text content of the layer

Simplifies horizontal scaling of your design – create duplicates with realistic data. Or populate screens with a bunch of prototype links – this way it's easy to create prototypes with minimum amount of "dead end". Using Excel approach allows to introduce other data stored in Excel, for example, you can connect your translation file and then populate layers depending on desired language. In general, there are many things you can do, it's totally up to your imagination.

While initial idea is to use JSON, a very efficient thing to do is to use an Excel/Google Sheet file, export it as .csv and then use any online [.csv to JSON converter](https://csvjson.com/) to generate JSON. The example of Excel file is given below.

## How to configure

To work, _Figma layers names should match names of JSON properties_. Depending of the value of JSON property a different action will be applied:

- Basic text: will replace text content of the layer
  Figma layer name:
  title
  JSON:
  `{ title: "Screen title" }`
- Boolean value: will hide/show layer
- VARIANT-{Name of property}-{Value of property}: switches variant of the layer
- `_frameName` used as a column name / JSON property will change name of the parent frame

JSON file example:

```json
[
	{
		"_frameName": "S1",
		"title": "Master and Margarita",
		"hasDecription": true,
		"description": "Devil vists Soviet Moscow",
		"addToCardBtnType": "VARIANT-Type-Primary"
	},
	{
		"_frameName": "S2",
		"title": "Crime and punishment",
		"hasDecription": false,
		"description": null,
		"addToCardBtnType": "VARIANT-Type-Primary"
	}
]
```

Excel configuration example – first row must always be generic column names that will later become JSON property names:

| \_frameName | title                | hasDescription | description                | addToCartButtonType   |
| ----------- | -------------------- | -------------- | -------------------------- | --------------------- |
| S1          | Master and Margarita | TRUE           | Devil visits Soviet Moscow | VARIANT-Type-Primary  |
| S2          | Crime and punishment | FALSE          |                            | VARIANT-Type-Disabled |

## It looks familiar

Yes, I started development of the plugin based on [JSON to Figma](https://www.figma.com/community/plugin/789839703871161985) plugin by Pavel Laptev. The recursive algorithm is taken from there and few features were added on top. After working on my own plugin for a while I realised that I can use Excel and .csv to produce JSON and after I was done with the plugin I noticed there is [Spreadsheet Sync (Altar.io)](https://www.figma.com/community/plugin/966291261554174793) by Andre Pinto, which is doing exactly that 🙈. While both plugins are extremely similar, my JSON-first version seems to work faster, so I decided to keep my work. But huge thanks to both developers!
