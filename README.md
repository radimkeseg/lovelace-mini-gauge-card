# Lovelace mini-gauge-card

A Home Assistant lovelace custom mini gauge card for any measurement.
![mini gauge card](https://github.com/radimkeseg/lovelace-mini-gauge-card/blob/main/images/mini-gauge-card.png)


## Usage
Add this card via HACS (recommended)
[HACS custom repositories](https://hacs.xyz/docs/faq/custom_repositories) add https://github.com/radimkeseg/lovelace-mini-gauge-card

Or manually :
Add this custom card to your home assistant instance. Reference it into your lovelace configuration.
```
  - type: js
    url: /local/lovelace/mini-gauge-card.js
```

Finally :
Add it as a custom card to your lovelace : `'custom:mini-gauge-card'`.

## Options
### Card options
| **Option** | **Type** | **Description** |
|-|:-:|-|
| `entity` ***(required)*** | string | an entity to track, make sure the entity state is a number |
| `min` ***(required)*** | number | minimum value of the gauge |
| `max` ***(required)*** | number | maximum value of the gauge |
| `measurement` | string | custom unit of measurement |
| `scale` | number | sizing factor, default = 1 |
| `decimals` | number | decimal precision of entity value. |

An example for a picture-element:
```yaml
type: picture-elements
elements:
  - type: custom:mini-gauge-card
    max: 30
    min: 15
    measurement: °C
    entity: sensor.esp_osmo_01_temp
    scale: 1
    style:
      top: 20%
      left: 63%
```

An example for a card:
```yaml
type: custom:thermo-valve-gauge
max: 25
min: 15
measurement: °C
entity: sensor.esp_osmo_01_temp
scale: 2
```

Time to time upgrading, mainly for my own purpose, anyway feel free to reuse ! 
PRs are welcome ;).
