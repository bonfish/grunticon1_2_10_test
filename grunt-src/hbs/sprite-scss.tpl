%icon{
	display:inline-block;
	background-image: url('{{{items.0.escaped_image}}}');
}
{{#items}}
.icon-{{name}},.with-icon-{{name}}:before{
	@extend %icon;
	width: {{px.width}};
	height: {{px.height}};
	background-position:{{px.offset_x}} {{px.offset_y}};
}
{{/items}}