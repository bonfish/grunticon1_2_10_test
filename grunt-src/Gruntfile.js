module.exports = function(grunt){
	var config = {
		// Конфигурацию берём отсюда
		pkg:grunt.file.readJSON('package.json'),
		// Переменные
		meta:{
			tmpDir:'.temp/',
			srcRoot:'',
			destRoot:'../assets/',
			tplDir:'../templates/',
			banner:"/* by bonflash | bonfable at ulanovka dot ru | 2014 */\n",
		},
		// SASS
		sass:{
			options:{
				style:'compressed',				
			},
			// основной стиль
			mainStyle:{
				files:[{
					expand:true,
					cwd:'<%= meta.srcRoot %>scss/',
					src:'*.scss',
					dest:'<%= meta.destRoot %>css/',
					ext:'.min.css',
					extDot:'last'
				}],
			}
		},
		// сжимаем JS
		uglify:{
			options:{
				preserveComments:'some',
			},
			regularJS:{
				options:{
					banner:'<%= meta.banner %>',
				},
				files:{
					'<%= meta.destRoot %>js/scripts.min.js': ['<%= meta.srcRoot %>js/*.js'],
				}
			}
		},
		// Оптимизируем SVG
		svgmin:{
			options:{
				plugins:[
					{cleanupIDs:{minify:false}},
					{removeRasterImages:false},
					{removeTitle:false},
					{removeXMLProcInst:false},
					{cleanupNumericValues:{floatPrecision:0}},
				]
			},
			icons:{
				files:[{
					expand:true,
					cwd:'<%= meta.srcRoot %>img/svg/',
					src:['**/*.svg', '!map-pin.svg'],
					dest:'<%= meta.tmpDir %>img/svg/',
					
				}],
			},
			careful:{
				options:{
					plugins:[
						{convertPathData:false},
						{cleanupIDs:{minify:false}},
						{removeRasterImages:false},
						{removeTitle:false},
						{removeXMLProcInst:false},
						{cleanupNumericValues:{floatPrecision:0}},
					]
				},
				files:[{
					expand:true,
					cwd:'<%= meta.srcRoot %>img/svg/',
					src:'map-pin.svg',
					dest:'<%= meta.tmpDir %>img/svg/',
					
				}],
			}
		},
		// SVG-спрайт
		grunticon:{
			icons:{
				files:[{
					expand:true,
					cwd:'<%= meta.tmpDir %>img/svg/',
					src:'**/*.svg',
					dest:'<%= meta.srcRoot %>',
				}],
				options: {
					datasvgcss: '<%= meta.srcRoot %>scss/sprite/sprite-svg.scss',
					datapngcss:'<%= meta.tmpDir %>scss/sprite/sprite-png.scss',
					urlpngcss:'<%= meta.tmpDir %>scss/sprite/sprite-png-fallback.scss',
					previewhtml: '<%= meta.tplDir %>svg.html',
					loadersnippet: '<%= meta.srcRoot %>js/grunticon.loader.js',
					pngfolder:'<%= meta.tmpDir %>img/png/',
					customselectors: {
						'*': ['.with-icon-$1:before'],
					},
					previewTemplate: '<%= meta.srcRoot %>hbs/html-template.hbs',
					template:'<%= meta.srcRoot %>hbs/svg-template.hbs',
					
				}
			}
		},
		// Отслеживаем
		watch:{
			js:{
				files:['<%= meta.srcRoot %>js/*.js'],
				tasks:['newer:uglify']
			},
			libJS:{
				files:['<%= meta.srcRoot %>js/libs/**/*.js'],
				tasks:['processJSLibs']
			},
			sass:{
				files:['<%= meta.srcRoot %>scss/**/*.scss'],
				tasks:['newer:sass:mainStyle']
			},
			livereload: {
				options: { livereload: 35727 },
				files: [
					'<%= meta.destRoot %>css/**/*.css', 
					'../templates/**/*.html', 
					'<%= meta.destRoot %>js/**/*.js', 
				],
			},
		},
	}
	grunt.initConfig(config);

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-newer');
	grunt.loadNpmTasks('grunt-grunticon');
	grunt.loadNpmTasks('grunt-svgmin');
	grunt.loadNpmTasks('grunt-spritesmith');
	
	grunt.registerTask('default', "Задача по умолчанию: геренируем CSS, JS (если исходники изменены), запускаем Watch", ['newer:sass', 'newer:uglify','watch']);
	grunt.registerTask('icons', "Minify SVG, Create sprites", ['newer:svgmin', 'grunticon']);
}