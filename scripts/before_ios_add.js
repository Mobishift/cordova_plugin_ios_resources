
module.exports = function(context){
	var path = context.requireCordovaModule('path'),
        fs = context.requireCordovaModule('fs'),
        projectRoot = context.opts.projectRoot,
		TEMPLATE = '<resource-file src="{{path}}" />';
	var pluginPath = path.join(projectRoot, 'plugins', 'com.mobishift.plugins.IOSResources');
	var pluginXml = path.join(pluginPath, 'plugin.xml');
	var filesPath = path.join(pluginPath, 'src', 'ios');
	var paths = fs.readdirSync(filesPath);
	
	console.info('there are ' + paths.length + 'resources');
	if(paths.length > 0){
		var pathContents = [];
		for(var i = 0; i < paths.length; i++){
			var file = ['src', 'ios', paths[i]].join('');
			pathContents.push(TEMPLATE.replace('{{path}}', file));
		}
		
		var pluginContent = fs.readFileSync(pluginXml, {encoding: 'utf8'});
		if(pluginContent.indexOf('<!--resources-->') >= 0 && pluginContent.indexOf('<!--endresources-->') >= 0){
			var contentStart = [pluginContent.split('<!--resources-->')[0], '<!--resources-->'].join('');
			var contentEnd = [pluginContent.split('<!--endresources-->')[1], '<!--endresources-->'].join('');
			pluginContent = [contentStart, pathContents.join('\n'), contentEnd].join('\n');
		}
		fs.writeFileSync(pluginXml, pluginContent);
	}
};