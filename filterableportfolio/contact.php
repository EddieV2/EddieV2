<?php session_start() ?>

<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
<html lang="en">
<head>
	<meta http-equiv="content-type" content="text/html;" charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<title>Hire Me</title>
	<meta name="description" content="loremLorem ipsum dolor sit amet, consectetuer adipiscing elit.">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="shortcut icon" type="image/x-icon" href="images/favicon.ico">
	<link rel="stylesheet" type="text/css" href="css/style.css">
	<link rel="stylesheet" type="text/css" href="css/media-queries.css">
	<link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Open+Sans:400,300|PT+Sans+Narrow">
	<!-- WP 8 Viewport fix - http://mattstow.com/responsive-design-in-ie10-on-windows-phone-8.html -->
	<script type="text/javascript">
		if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
	  var msViewportStyle = document.createElement("style");
	  msViewportStyle.appendChild(
	    document.createTextNode(
	      "@-ms-viewport{width:auto!important}"
	    )
	  );
	  document.getElementsByTagName("head")[0].
	    appendChild(msViewportStyle);
	}
	</script>
	<script type="text/javascript" src="https://code.jquery.com/jquery-latest.min.js"></script>

	<!-- Pure instead of Normalize -->
    <link rel="stylesheet" type="text/css" href="https://yui.yahooapis.com/pure/0.2.1/pure-min.css">
	<script type="text/javascript" src="js/modernizr-2.6.2.min.js"></script>
</head>
<div class="container">
        
        <h2 id="contact_h2">Contact</h2>
        <p id="contact_subtext">I’d love to hear about job opportunities, suggestions to my site, or anything else at all</p>
        <!-- <img id="contact_divider" src="img/contact_divider.png" width="599" height="1" /> -->
        
        
        <div id="contact-form" class="clearfix">
                <?php
//init variables
$cf = array();
$sr = false;
if(isset($_SESSION['cf_returndata'])){
    $cf = $_SESSION['cf_returndata'];
    $sr = true;
}
?>
      <ul id="errors" class="<?php echo ($sr && !$cf['form_ok']) ? 'visible' : ''; ?>">
        <li id="info">There were some problems with your form submission:</li>
        <?php
        if(isset($cf['errors']) && count($cf['errors']) > 0) :
            foreach($cf['errors'] as $error) :
        ?>
        <li><?php echo $error ?></li>
        <?php
            endforeach;
        endif;
        ?>
    </ul>
    <p id="success" class="<?php echo ($sr && $cf['form_ok']) ? 'visible' : ''; ?>">Thank you for your inquiry! I'll contact you as soon as possible.</p>
    <form method="post" action="process.php">
        <label for="name">Name: <span class="required">*</span></label>
<input type="text" id="name" name="name" value="<?php echo ($sr && !$cf['form_ok']) ? $cf['posted_form_data']['name'] : '' ?>" placeholder="Tom Brady" required autofocus />
<label for="email">Email Address: <span class="required">*</span></label>
<input type="email" id="email" name="email" value="<?php echo ($sr && !$cf['form_ok']) ? $cf['posted_form_data']['email'] : '' ?>" placeholder="tombrady@example.com" required />
<label for="telephone">Telephone: </label>
<input type="tel" id="telephone" name="telephone" value="<?php echo ($sr && !$cf['form_ok']) ? $cf['posted_form_data']['telephone'] : '' ?>" />
<!--<label for="enquiry">Enquiry: </label>
<select id="enquiry" name="enquiry">
    <option value="General" <?php echo ($sr && !$cf['form_ok'] && $cf['posted_form_data']['enquiry'] == 'General') ? "selected='selected'" : '' ?>>General</option>
    <option value="Sales" <?php echo ($sr && !$cf['form_ok'] && $cf['posted_form_data']['enquiry'] == 'Sales') ? "selected='selected'" : '' ?>>Sales</option>
    <option value="Support" <?php echo ($sr && !$cf['form_ok'] && $cf['posted_form_data']['enquiry'] == 'Support') ? "selected='selected'" : '' ?>>Support</option>-->
</select>
<label for="message">Message: <span class="required">*</span></label>
<textarea id="message" name="message" placeholder="Your message must be greater than 20 charcters" required data-minlength="20"><?php echo ($sr && !$cf['form_ok']) ? $cf['posted_form_data']['message'] : '' ?></textarea>
<span id="loading"></span>
<input type="submit" value="Submit" id="submit-button" />
<p id="req-field-desc"><span class="required">*</span> indicates a required field</p>
    </form>
    <?php unset($_SESSION['cf_returndata']); ?> 
</div>

</div> <!-- end container -->

    <footer>
		<p>&copy; 2013 Eddie Vartanessian</p>
	</footer>
        
    </body>
</html>