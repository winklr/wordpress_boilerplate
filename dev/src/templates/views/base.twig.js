module.exports = (settings) => `
<!DOCTYPE html>
<html class="no-js" lang="{{ site.language }}">
<head>
	<meta charset="{{ site.charset }}">
	<meta http-equiv="x-ua-compatible" content="ie=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="author" content="${settings.author.name}${settings.author.email ? ` <${settings.author.email}>` : ''}${settings.author.url ? ` (${settings.author.url})` : ''}">
	<script>document.documentElement.className = document.documentElement.className.replace(/\bno-js\b/g, 'js');</script>
	{{ function('wp_head') }}
</head>

<body class="{{ body_class }}">
	
	{{ include('common/_mainnav.twig') }}
	
	<div class="page-header">
        {% block header -%}

        {% endblock -%}
    </div>

	{% block content -%}

	{% endblock -%}

	<footer>
	</footer>

	{{ function('wp_footer') }}

</body>
</html>
`;
