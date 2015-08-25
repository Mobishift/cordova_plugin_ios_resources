
module.exports = function(context){
	var path = context.requireCordovaModule('path'),
        fs = context.requireCordovaModule('fs'),
        projectRoot = context.opts.projectRoot,
		TEMPLATE = '<resource-file src="{{path}}" />';
	var pluginPath = path.join(projectRoot, 'plugins', 'com.mobishift.plugins.IOSResources');
	var pluginXml = path.join(pluginPath, 'plugin.xml');
	var filesPath = path.join(pluginPath, 'src', 'ios');
	
	var paths = [];
	if(fs.existsSync(filesPath)){
		paths = fs.readdirSync(filesPath);
	}
	
	var pathContents = [];
	if(paths.length > 0){
		for(var i = 0; i < paths.length; i++){
			var file = ['src', '/ios/', paths[i]].join('');
			pathContents.push(TEMPLATE.replace('{{path}}', file));
		}
	}
	
	var configPath = path.join(projectRoot, 'config.json');
	if(fs.existsSync(configPath)){
		var config = JSON.parse(fs.readdirSync(configPath, {encoding: 'utf8'}));
		if(config.RESOURCES){
			for(var i = 0; i < config.RESOURCES.length; i++){
				if(fs.existsSync(config.RESOURCES[i])){
					paths = fs.readdirSync(config.RESOURCES[i]);
					if(paths.length > 0){
						for(var i = 0; i < paths.length; i++){
							var f = ['src', '/ios/', paths[i]].join('');
							pathContents.push(TEMPLATE.replace('{{path}}', f));
						}
					}
				}
			}
		}	
	}
	
	var pluginContent = fs.readFileSync(pluginXml, {encoding: 'utf8'});
	if(pluginContent.indexOf('<!--resources-->') >= 0 && pluginContent.indexOf('<!--endresources-->') >= 0){
		var contentStart = [pluginContent.split('<!--resources-->')[0], '<!--resources-->'].join('');
		var contentEnd = [pluginContent.split('<!--endresources-->')[1], '<!--endresources-->'].join('');
		pluginContent = [contentStart, pathContents.join('\n'), contentEnd].join('\n');
	}
	fs.writeFileSync(pluginXml, pluginContent);
};