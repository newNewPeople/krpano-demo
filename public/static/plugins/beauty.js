/*
 * @description 美化插件
 * @Author: hujiajun
 * @Date: 2020-05-09 17:14:48 
 * @Last Modified time: 2020-05-11 16:47:48 
 */

var krpanoplugin = function () {
	var local = this;

	// internal plugin information
	local.name = "beauty";

	var krpano = null;
	var plugin = null;

	// krpano WebGL pixel shader
	var shader = [];

	// xml attributes
	var xml_brightness = 0.0;
	var xml_contrast = 0.0;
	var xml_saturation = 0.0;
	var xml_hue = 0.0;
	var xml_color_r = 1.0;
	var xml_color_g = 1.0;
	var xml_color_b = 1.0;

	function get_shader_src() {
		return "" +
			"precision mediump float;" +
			"uniform sampler2D sm;" + // sm = the screen as input texture sampler
			"uniform float brightness_factor;" + // a custom uniform
			"uniform float contrast_factor;" + // a custom uniform
			"uniform float saturation_factor;" + // a custom uniform
			"uniform float hue_factor;" + // a custom uniform
			"uniform float r_factor;" + // a custom uniform
			"uniform float g_factor;" + // a custom uniform
			"uniform float b_factor;" + // a custom uniform
			"varying vec2 tx;" + // tx = the texture coordinates (0.0,0.0 to 1.0,1.0)
			"void main()" +
			"{" +
			"vec4 color = texture2D(sm,vec2(tx.x, tx.y));" +
			"color.rgb += brightness_factor;" +
			"if (contrast_factor > 0.0) {" +
			"color.rgb = (color.rgb - 0.5) / (1.0 - contrast_factor) + 0.5;" +
			"} else {" +
			"color.rgb = (color.rgb - 0.5) * (1.0 + contrast_factor) + 0.5;" +
			"}" +
			"float angle = hue_factor * 3.14159265;" +
			"float s = sin(angle), c = cos(angle);" +
			"vec3 weights = (vec3(2.0 * c, -sqrt(3.0) * s - c, sqrt(3.0) * s - c) + 1.0) / 3.0;" +
			"float len = length(color.rgb);" +
			"color.rgb = vec3(" +
			"dot(color.rgb, weights.xyz)," +
			"dot(color.rgb, weights.zxy)," +
			"dot(color.rgb, weights.yzx)" +
			");" +
			"float average = (color.r + color.g + color.b) / 3.0;" +
			"if (saturation_factor > 0.0) {" +
			"color.rgb += (average - color.rgb) * (1.0 - 1.0 / (1.001 - saturation_factor));" +
			"} else {" +
			"color.rgb += (average - color.rgb) * (-saturation_factor);" +
			"}" +
			"vec4 newcolor = vec4(color.r * r_factor, color.g * g_factor, color.b * b_factor, 1.0);" +
			"gl_FragColor = newcolor;" +
			"}";
	}

	// plugin entry point
	local.registerplugin = function (krpanointerface, pluginpath, pluginobject) {
		krpano = krpanointerface;
		plugin = pluginobject;

		if (krpano.version < "1.19" || krpano.build < "2016-04-01") {
			krpano.trace(3, local.name + " - too old krpano version (min. 1.19)");
			return;
		}


		// check for WebGL support
		if (krpano.webGL) {
			// create a custom shader with a 'sharpen_factor' uniform and
			// a 'sz' uniform (a krpano internal uniform for the screen size)
			shader = krpano.webGL.createPostProcessingShader(get_shader_src(), "brightness_factor,contrast_factor,saturation_factor,hue_factor,r_factor,g_factor,b_factor,sz");

			if (shader) {
				// add the shader as last one to an Array of krpano post-processing shaders
				krpano.webGL.ppShaderArray.push(shader);

				// add plugin attributes (will automatically also call the 'set' callback to init the value)
				plugin.registerattribute("xml_brightness", xml_brightness, api_brightness_set, api_brightness_get);
				plugin.registerattribute("xml_contrast", xml_contrast, api_contrast_set, api_contrast_get);
				plugin.registerattribute("xml_saturation", xml_saturation, api_saturation_set, api_saturation_get);
				plugin.registerattribute("xml_hue", xml_hue, api_hue_set, api_hue_get);
				plugin.registerattribute("xml_color_r", xml_color_r, api_color_r_set, api_color_r_get);
				plugin.registerattribute("xml_color_g", xml_color_g, api_color_g_set, api_color_g_get);
				plugin.registerattribute("xml_color_b", xml_color_b, api_color_b_set, api_color_b_get);
			}
		}
	}

	function remove_shader_from_krpano() {
		// get the Array of krpano post-processing shader
		var ppShaderArray = krpano.webGL.ppShaderArray;

		// look for the own-added shader and remove it
		for (i = 0; i < ppShaderArray.length; i++) {
			if (ppShaderArray[i] === shader) {
				ppShaderArray.splice(i, 1);
				break;
			}
		}
	}

	local.unloadplugin = function () {
		if (shader) {
			krpano.webGL.deleteShader(shader);

			remove_shader_from_krpano();
			shader = null;
		}

		krpano = null;
		plugin = null;
	}


	function api_brightness_set(value) {
		// convert to number
		value = Number(value);

		// is a valid number?
		if (!isNaN(value)) {
			xml_brightness = value;

			// update the shader uniform
			api_brightness_update();
		}
	}

	function api_contrast_set(value) {
		// convert to number
		value = Number(value);

		// is a valid number?
		if (!isNaN(value)) {
			xml_contrast = value;

			// update the shader uniform
			api_contrast_update();
		}
	}

	function api_saturation_set(value) {
		// convert to number
		value = Number(value);

		// is a valid number?
		if (!isNaN(value)) {
			xml_saturation = value;

			// update the shader uniform
			api_saturation_update();
		}
	}

	function api_hue_set(value) {
		// convert to number
		value = Number(value);

		// is a valid number?
		if (!isNaN(value)) {
			xml_hue = value;

			// update the shader uniform
			api_hue_update();
		}
	}

	function api_color_r_set(value) {
		// convert to number
		value = Number(value);

		// is a valid number?
		if (!isNaN(value)) {
			xml_color_r = value;
			// update the shader uniform
			api_color_r_update();
		}
	}

	function api_color_g_set(value) {
		// convert to number
		value = Number(value);

		// is a valid number?
		if (!isNaN(value)) {
			xml_color_g = value;

			// update the shader uniform
			api_color_g_update();
		}
	}

	function api_color_b_set(value) {
		// convert to number
		value = Number(value);

		// is a valid number?
		if (!isNaN(value)) {
			xml_color_b = value;

			// update the shader uniform
			api_color_b_update();
		}
	}

	function api_brightness_get() {
		return xml_brightness;
	}

	function api_contrast_get() {
		return xml_contrast;
	}

	function api_saturation_get() {
		return xml_saturation;
	}

	function api_hue_get() {
		return xml_hue;
	}

	function api_color_r_get() {
		return xml_color_r;
	}

	function api_color_g_get() {
		return xml_color_g;
	}

	function api_color_b_get() {
		return xml_color_b;
	}

	function api_brightness_update() {
		// update the shader
		if (shader) {
			// select/activate the shader for interfacing
			krpano.webGL.useShader(shader);

			// set/update the value for the 'saturation_factor' uniform
			krpano.webGL.context.uniform1f(shader.brightness_factor, xml_brightness);
			// console.log(xml_brightness);

			// restore
			krpano.webGL.useShader(null);
		}
	}

	function api_saturation_update() {
		// update the shader
		if (shader) {
			// select/activate the shader for interfacing
			krpano.webGL.useShader(shader);

			// set/update the value for the 'saturation_factor' uniform
			krpano.webGL.context.uniform1f(shader.saturation_factor, xml_saturation);
			// console.log(xml_saturation);

			// restore
			krpano.webGL.useShader(null);
		}
	}

	function api_hue_update() {
		// update the shader
		if (shader) {
			// select/activate the shader for interfacing
			krpano.webGL.useShader(shader);

			// set/update the value for the 'hue_factor' uniform
			krpano.webGL.context.uniform1f(shader.hue_factor, xml_hue);
			// console.log(xml_hue);

			// restore
			krpano.webGL.useShader(null);
		}
	}

	function api_contrast_update() {
		// update the shader
		if (shader) {
			// select/activate the shader for interfacing
			krpano.webGL.useShader(shader);

			// set/update the value for the 'saturation_factor' uniform
			krpano.webGL.context.uniform1f(shader.contrast_factor, xml_contrast);
			// console.log(xml_contrast);

			// restore
			krpano.webGL.useShader(null);
		}
	}

	function api_color_r_update() {
		// update the shader
		if (shader) {
			// select/activate the shader for interfacing
			krpano.webGL.useShader(shader);

			// set/update the value for the 'r_factor' uniform
			krpano.webGL.context.uniform1f(shader.r_factor, xml_color_r);
			// console.log(xml_color_r);

			// restore
			krpano.webGL.useShader(null);
		}
	}

	function api_color_g_update() {
		// update the shader
		if (shader) {
			// select/activate the shader for interfacing
			krpano.webGL.useShader(shader);

			// set/update the value for the 'g_factor' uniform
			krpano.webGL.context.uniform1f(shader.g_factor, xml_color_g);
			// console.log(xml_color_g);

			// restore
			krpano.webGL.useShader(null);
		}
	}

	function api_color_b_update() {
		// update the shader
		if (shader) {
			// select/activate the shader for interfacing
			krpano.webGL.useShader(shader);

			// set/update the value for the 'saturation_b' uniform
			krpano.webGL.context.uniform1f(shader.b_factor, xml_color_b);
			// console.log(xml_color_b);

			// restore
			krpano.webGL.useShader(null);
		}
	}

}