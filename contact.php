<? include("header.php"); ?>

    <body>
        <!--[if lt IE 7]>
            <p class="chromeframe">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">activate Google Chrome Frame</a> to improve your experience.</p>
        <![endif]-->

        <!-- Add your site or application content here -->
        
        <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.8.2.min.js"><\/script>')</script>
        <script src="js/plugins.js"></script>
        <script src="js/main.js"></script>

<header>
  	<div class="container">
    	<h1>EDDIE V2</h1>
        	<div class="nav">
        		<ul>
                	<li>
                    <a href="index.php" class="navitem">Home</a>
                    </li>
                    <li>
                    <a href="about.php" class="navitem">About</a>
                    </li>
                    <li>
                    <a href="contact.php" class="navitem-active">Contact</a>
                    </li>
                </ul>
            </div>
      <ul class="social">
          <li><a href="https://plus.google.com/117474408036036261956" target="_blank"><img id="googleplus-sprite" src="img/blank.gif" width="20" height="20" /></a></li>
          <li><a href="http://pinterest.com/eddiev2/" target="_blank"><img id="pinterest-sprite" src="img/blank.gif" width="20" height="20" /></a></li>
          <li><a href="http://www.linkedin.com/in/evartanessian" target="_blank"><img id="linkedin-sprite" src="img/blank.gif" width="20" height="20" /></a></li>
          <li><a href="http://twitter.com/eddie255" target="_blank"><img id="twitter-sprite" src="img/blank.gif" width="20" height="20" /></a></li>
<!--      <li><a href="http://www.facebook.com/evartanessian" target="_blank"><img src="img/facebook.png" alt="facebook" /></a></li>-->
      </ul>
   	</div> <!-- end container -->
    	
 </header>
 
 <div class="container">
        
        <h2 id="contact_h2">Contact</h2>
        <p id="contact_subtext">I’d love to hear about job opportunities, suggestions to my site, or anything else at all</p>
        <img id="contact_divider" src="img/contact_divider.png" width="599" height="1" />
        
        
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
		<p>Copyright &copy; 2012 Eddie Vartanessian</p>
	</footer>
        
    </body>
</html>
