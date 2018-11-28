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

	<header block="siteHeader">
		<a elem="logo" href="{{ site.url }}">{{ site.name }}</a>
		<nav elem="menu">
			<h1 class="hidden">Main menu</h1>
			<ul elem="menuList">
				{% for item in menus.main.get_items -%}
					<li elem="menuItem" class="{{ item.class }}"><a elem="menuLink" href="{{ item.get_link }}">{{ item.title }}</a></li>
				{% endfor -%}
			</ul>
		</nav>
	</header>

	{% block content -%}

	{% endblock -%}

	<footer>
	</footer>

	{{ function('wp_footer') }}

</body>
</html>
`;
