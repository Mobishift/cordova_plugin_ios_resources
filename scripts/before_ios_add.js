
module.exports = function(context){
	var path = context.requireCordovaModule('path'),
        fs = context.requireCordovaModule('fs'),
        projectRoot = context.opts.projectRoot,
		TEMPLATE = '<resource-file src="{{path}}" />';
	var pluginPath = path.join(projectRoot, 'plugins', 'com.mobishift.plugins.IOSResources');
	var pluginXml = path.join(pluginPath, 'plugin.xml');
	var filesPath = path.join(pluginPath, 'src', 'ios');
	
	var clearPath = function(){
		console.info('clearing the resources directory...');
		if(fs.existsSync(filesPath)){
			var paths = [];
			paths = fs.readdirSync(filesPath);
			for(var i = 0; i < paths.length; i++){
				fs.unlinkSync(path.join(filesPath, paths[i]));
			}
		}else{
			if(!fs.existsSync(path.join(pluginPath, 'src'))){
				fs.mkdirSync(path.join(pluginPath, 'src'));
			}
			fs.mkdirSync(filesPath);
		}
	};
	
	var copyFiles = function(){
		var configPath = path.join(projectRoot, 'config.json');
		if(fs.existsSync(configPath)){
			var config = JSON.parse(fs.readFileSync(configPath, {encoding: 'utf8'}));
			if(config.RESOURCES){
				console.info('copying file to plugin...');
				for(var i = 0; i < config.RESOURCES.length; i++){
					if(fs.existsSync(config.RESOURCES[i])){
						var paths = fs.readdirSync(path.join(projectRoot, config.RESOURCES[i]));
						if(paths.length > 0){
							for(var j = 0; j < paths.length; j++){
								if(paths[j].indexOf('.') !== 0){
									console.info('copying ' + path.join(projectRoot, config.RESOURCES[i], paths[j]) + ' to ' + path.join(filesPath, paths[j]));
									var target = path.join(filesPath, paths[j]);
									var origin = path.join(projectRoot, config.RESOURCES[i], paths[j]);
									fs.writeFileSync(target, fs.readFileSync(origin));
									// pathContents.push(TEMPLATE.replace('{{path}}', f));
								}
							}
						}
					}
				}
			}
		}
	};
	
	var settingPlugin = function(){
		var paths = [];
		if(fs.existsSync(filesPath)){
			paths = fs.readdirSync(filesPath);
		}
		var pathContents = [];
		if(paths.length > 0){
			console.info('setting plugin resources...');
			for(var i = 0; i < paths.length; i++){
				if(paths[i].indexOf('.') !== 0){
					var file = ['src', '/ios/', paths[i]].join('');
					pathContents.push(TEMPLATE.replace('{{path}}', file));
				}
			}
		}
		var pluginContent = fs.readFileSync(pluginXml, {encoding: 'utf8'});
		if(pluginContent.indexOf('<!--resources-->') >= 0 && pluginContent.indexOf('<!--endresources-->') >= 0){
			var contentStart = [pluginContent.split('<!--resources-->')[0], '<!--resources-->'].join('');
			var contentEnd = ['<!--endresources-->', pluginContent.split('<!--endresources-->')[1]].join('');
			pluginContent = [contentStart, pathContents.join('\n'), contentEnd].join('\n');
		}
		fs.writeFileSync(pluginXml, pluginContent);
	};
	
	clearPath();
	copyFiles();
	settingPlugin();
};