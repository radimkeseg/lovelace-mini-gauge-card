console.info(`%c MINI-GAUGE-CARD \n%c       v0.2-beta `, 'color: orange; font-weight: bold; background: black', 'color: white; font-weight: bold; background: dimgray');
class MiniGaugeCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  setConfig(config) {
    if (!config.entity) {
      throw new Error('Please define an entity');
    }
	if (config.max == null) {
		throw new Error('Please define the max config option');
	}
	if (config.min == null) {
		throw new Error('Please define the min config option');
	}
	
    const root = this.shadowRoot;
    if (root.lastChild) root.removeChild(root.lastChild);

    const cardConfig = Object.assign({}, config);
    if (!cardConfig.scale) cardConfig.scale = "1";

    
    const entityParts = this._splitEntityAndAttribute(cardConfig.entity);
    cardConfig.entity = entityParts.entity;
    if (entityParts.attribute) cardConfig.attribute = entityParts.attribute;

    
    if (config.icon_color !== undefined) {
        var icon_color = config.icon_color;
    } else {
        var icon_color = "var(--paper-item-icon-color)";
    }
	    
    const card = document.createElement('ha-card');
    const content = document.createElement('div');
    const style = document.createElement('style');

    style.textContent = `
      ha-card {
        --base-unit: ${cardConfig.scale};
        height: calc(var(--base-unit)*80px);
        position: relative;
      }
      .container{
        width: calc(var(--base-unit) * 100px);
        height: calc(var(--base-unit) * 80px);
        position: absolute;
        top: 0px;
        left: 50%;
        overflow: hidden;
        text-align: center;
        transform: translate(-50%, 0%);
      }	  
	  
		#mini-gauge-card-hand, #mini-gauge-card-bar{
		  transition-duration: 2s;
		  transform-origin: 100px 140px;
		}	
      .mini-gauge-card-text{
		  fill: var(--primary-text-color);
	  }		  
    `;
	
    content.innerHTML = `
    <div class="container">
		<div class="mini-gauge-card">
		    <svg viewBox="0 0 200 160" style="transform-origin:left top;">		
  <g
     id="layer1"
     transform="translate(0,-45)">

	<clipPath id="mini-gauge-card-bar" style="transition-duration: 2s">
	   <!-- the rotate(?deg) is about to be dynamically updated -->
	   <path style="fill:#ffffff;stroke:none;fill-opacity:1" d="M 40,140 H 160 c 0,0 0,60 -60,60 -60,0 -60,-60 -60,-60"/>
	</clipPath>	
	 
    <path
       style="fill:none;stroke:#ff0000;stroke-width:5;stroke-opacity:1"
       d="m 45,140 c 0,-72 110,-72 110,0"
       id="mini-gauge-card-bar-line" clip-path="url(#mini-gauge-card-bar)" fill="red"/>
	   
    
	<text class="mini-gauge-card-text"
       style="font-style:normal;font-weight:normal;font-size:10px;font-family:sans-serif;letter-spacing:0px;word-spacing:0px;"
       x="45"
       y="158"
       id="mini-gauge-card-min"
	   text-anchor="middle">?</text>
    <text class="mini-gauge-card-text"
       style="font-style:normal;font-weight:normal;font-size:10px;font-family:sans-serif;letter-spacing:0px;word-spacing:0px;"
       x="155"
       y="158"
       id="mini-gauge-card-max"
	   text-anchor="middle">?</text>
    <text class="mini-gauge-card-text"
       style="font-style:normal;font-weight:bold;font-size:20px;font-family:sans-serif;letter-spacing:0px;word-spacing:0px;"
       x="100"
       y="120"
       id="mini-gauge-card-mean"
	   text-anchor="middle">?</text>	 
    <text class="mini-gauge-card-text"
       style="font-style:normal;font-weight:bold;font-size:12px;font-family:sans-serif;letter-spacing:0px;word-spacing:0px;"
       x="100"
       y="158"
       id="mini-gauge-card-name"
	   text-anchor="middle">?</text>
	   
    <path
       style="fill:none;stroke:#aaaaaa;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:2.5, 6;stroke-dashoffset:0;stroke-opacity:1"
       d="m 45,140 c 0,-72 110,-72 110,0"
       id="gauge" />
   <g
       id="mini-gauge-card-hand">
      <path
         id="mini-gauge-card-hand-shape"
         d="m 110,140 -10,5 -55,-5 55,-5 z"
         style="fill:#222222;fill-opacity:1;stroke:#dddddd;stroke-width:1px;stroke-opacity:1" />
      <path
         id="mini-gauge-card-hand-shade"
         d="m 110,140 -10,5 -55,-5 C 62,140 105,140 105,140 Z"
         style="fill:#888888;fill-opacity:1;stroke:none;" />
    </g>
    <circle
       style="opacity:1;fill:#666666;fill-opacity:1;fill-rule:nonzero;stroke:#999999;stroke-width:2;stroke-opacity:1"
       id="dot"
       cx="100"
       cy="140"
       r="2.5" />	 
   </g>
			</svg>
		</div>	
	</div>	
	`;
	
    card.appendChild(content);
    card.appendChild(style);
	
    card.addEventListener('click', event => {
      this._fire('hass-more-info', { entityId: cardConfig.entity });
    });
    root.appendChild(card);
    this._config = cardConfig;	
  }

  _splitEntityAndAttribute(entity) {
      let parts = entity.split('.');
      if (parts.length < 3) {
          return { entity: entity };
      }

      return { attribute: parts.pop(), entity: parts.join('.') };
  }

  _fire(type, detail, options) {
    const node = this.shadowRoot;
    options = options || {};
    detail = (detail === null || detail === undefined) ? {} : detail;
    const event = new Event(type, {
      bubbles: options.bubbles === undefined ? true : options.bubbles,
      cancelable: Boolean(options.cancelable),
      composed: options.composed === undefined ? true : options.composed
    });
    event.detail = detail;
    node.dispatchEvent(event);
    return event;
  }

  _translateRotation(value, config) {
	if( value < config.min ) value = config.min;  
	if( value > config.max ) value = config.max; 	  
    return 180*((value - config.min) / (config.max - config.min));
  }
  
  _computeSeverity(stateValue, sections) {
    let numberValue = Number(stateValue);
	const severityMap = {
		red: "var(--error-color)",
		red_L: "var(--error-color)",
		red_H: "var(--error-color)",
		green: "var(--success-color)",
		green_L: "var(--success-color)",
		green_H: "var(--success-color)",
		yellow: "var(--warning-color)",
		yellow_L: "var(--warning-color)",
		yellow_H: "var(--warning-color)",
		normal: "var(--info-color)",
	};
    if (!sections) return severityMap["normal"];
    
	let sortable = [];
	for (let severity in sections) {
      sortable.push([severity, sections[severity]]);
    }
    sortable.sort((a, b) => { return a[1] - b[1] });
	
	let retVal = severityMap["normal"];
	for (let i = 0; i < sortable.length; i++){
	  if (numberValue >= sortable[i][1]) {
		 retVal = severityMap[sortable[i][0]];
	  } 
	}
	return retVal;  
  }
  _getEntityStateValue(entity, attribute) { 
    if (!attribute) {
      return entity.state;
    }

    return entity.attributes[attribute];
  }

  set hass(hass) {
    const root = this.shadowRoot;
    const config = this._config;
    var entityState = this._getEntityStateValue(hass.states[config.entity], config.attribute);
    var maxEntityState = null;
    var minEntityState = null;

    let measurement = "";
    if (config.measurement == null) {
      if (hass.states[config.entity].attributes.unit_of_measurement === undefined) {
        measurement = '';
      } else {
        measurement = hass.states[config.entity].attributes.unit_of_measurement;
      }
    } else {
      measurement = config.measurement;
    }

	root.getElementById("mini-gauge-card-min").innerHTML = config.min;
	root.getElementById("mini-gauge-card-max").innerHTML = config.max;

    if(config.stroke !== undefined){
	  root.getElementById("mini-gauge-card-bar-line").style['stroke-width'] = config.stroke;
	}
    
    // Set decimal precision
    if (config.decimals !== undefined) {
	  // Only allow positive numbers
	  if (config.decimals >= 0) {
		entityState = Math.round(parseFloat(entityState) * (10 ** config.decimals)) / (10 ** config.decimals)   // Round (https://stackoverflow.com/a/11832950)
		entityState = entityState.toFixed(config.decimals)  // Add trailing zeroes if applicable        
	  }
    }

	if (entityState !== this._entityState) {
      root.getElementById("mini-gauge-card-mean").textContent = `${entityState}${measurement}`;
      const rot = this._translateRotation(entityState, config);
      root.getElementById("mini-gauge-card-hand").style.transform = `rotate(${rot}deg)`;
      root.getElementById("mini-gauge-card-bar").style.transform = `rotate(${rot}deg)`;
	  root.getElementById("mini-gauge-card-bar-line").style.stroke = this._computeSeverity(entityState, config.severity);

	  var friendly_name = config.title!== undefined ? config.title : this._getEntityStateValue(hass.states[config.entity], "friendly_name");
      root.getElementById("mini-gauge-card-name").textContent = `${friendly_name}`;

      this._entityState = entityState;		
    }
    root.lastChild.hass = hass;
  }

  getCardSize() {
    return 1;
  }
}

customElements.define('mini-gauge-card', MiniGaugeCard);
