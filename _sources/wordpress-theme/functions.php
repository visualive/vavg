<?php
// Exit if accessed directly
if ( !defined( 'ABSPATH' ) ) {
    exit;
}


define( 'YOUR_THEME_VERSION_NUM', '1.0.0' );


if ( ! function_exists( 'your_themename_setup' ) ) :
/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * Note that this function is hooked into the after_setup_theme hook, which
 * runs before the init hook. The init hook is too late for some features, such
 * as indicating support for post thumbnails.
 *
 * @since Your theme name 1.0.0
 */
function your_themename_setup() {
    /*
     * Remove emoji scripts.
     */
    remove_action( 'wp_head',             'print_emoji_detection_script', 7 );
    remove_action( 'admin_print_scripts', 'print_emoji_detection_script'    );
    remove_action( 'wp_print_styles',     'print_emoji_styles'              );
    remove_action( 'admin_print_styles',  'print_emoji_styles'              );
    remove_filter( 'the_content_feed',    'wp_staticize_emoji'              );
    remove_filter( 'comment_text_rss',    'wp_staticize_emoji'              );
    remove_filter( 'wp_mail',             'wp_staticize_emoji_for_email'    );

    /*
     * Remove actions.
     */
    remove_action( 'wp_head', 'rsd_link'                        );
    remove_action( 'wp_head', 'wlwmanifest_link'                );
    remove_action( 'wp_head', 'adjacent_posts_rel_link_wp_head' );
    remove_action( 'wp_head', 'wp_shortlink_wp_head'            );
    remove_action( 'wp_head', 'wp_generator'                    );
    remove_action( 'wp_head', 'jetpack_og_tags'                 );

    /*
     * This theme supports all available post formats by default.
     * See https://codex.wordpress.org/Post_Formats
     */
    add_theme_support( 'post-formats', array(
        'aside', 'audio', 'chat', 'gallery', 'image', 'link', 'quote', 'status', 'video'
    ) );

    /*
     * Adds RSS feed links to <head> for posts and comments.
     */
    add_theme_support( 'automatic-feed-links' );

    /*
     * Switches default core markup for search form, comment form,
     * and comments to output valid HTML5.
     */
    add_theme_support( 'html5', array(
        'search-form', 'comment-form', 'comment-list', 'gallery', 'caption'
    ) );

    /*
     * Let WordPress manage the document title.
     * By adding theme support, we declare that this theme does not use a
     * hard-coded <title> tag in the document head, and expect WordPress to
     * provide it for us.
     */
    add_theme_support( 'title-tag' );

    /*
     * This theme uses a custom image size for featured images, displayed on
     * "standard" posts and pages.
     */
    add_theme_support( 'post-thumbnails' );
}
endif; // your_themename_setup
add_action( 'after_setup_theme', 'your_themename_setup' );


if ( ! function_exists( 'your_themename_scripts' ) ) :
/**
 * Enqueue scripts and styles.
 *
 * @since Your theme name 1.0.0
 */
function your_themename_scripts() {
    $scripts = array(
        array(
            'handle'    => 'your-themename',
            'src'       => get_stylesheet_uri(),
            'deps'      => array(),
            'ver'       => YOUR_THEME_VERSION_NUM,
        ),
        array(
            'handle'    => 'jquery',
            'src'       => includes_url( '/js/jquery/jquery.js' ),
            'deps'      => array(),
            'ver'       => '1.11.2',
            'in_footer' => true
        ),
        array(
            'handle'    => 'your-themename',
            'src'       => get_template_directory_uri() . '/assets/js/script.min.js',
            'deps'      => array( 'jquery' ),
            'ver'       => YOUR_THEME_VERSION_NUM,
            'in_footer' => true
        ),
        array(
            'handle'    => 'your-themename-ie',
            'src'       => get_template_directory_uri() . '/assets/js/ie.min.js',
            'deps'      => array(),
            'ver'       => YOUR_THEME_VERSION_NUM,
            'in_footer' => false,
            'data'      => array(
                'handle' => 'your-themename-ie',
                'key'    => 'conditional',
                'value'  => 'lt IE 9'
            )
        )
    );

    /*
     * Load enqueued scripts in the Footer.
     */
    remove_action( 'wp_head', 'wp_print_scripts'         );
    remove_action( 'wp_head', 'wp_print_head_scripts', 9 );
    remove_action( 'wp_head', 'wp_enqueue_scripts',    1 );
    add_action( 'wp_footer',  'wp_print_head_scripts', 5 );
    add_action( 'wp_footer',  'wp_print_scripts',      5 );
    add_action( 'wp_footer',  'wp_enqueue_scripts',    1 );

    /*
     * Remove a registered script.
     */
    wp_deregister_script( 'jquery' );

    /*
     * Load our framework stylesheet and javascript.
     */
    foreach( $scripts as $script ) {
        $path = pathinfo( $script['src'] );
        $ext  = $path['extension'];

        switch ( $ext ) {
            case 'css':
                wp_enqueue_style( $script['handle'], $script['src'], $script['deps'], $script['ver'] );
                if ( isset( $script['data'] ) && is_array( $script['data'] ) ) {
                    wp_style_add_data( $script['data']['handle'], $script['data']['key'], $script['data']['value'] );
                }
                break;
            case 'js':
                wp_enqueue_script( $script['handle'], $script['src'], $script['deps'], $script['ver'], $script['in_footer'] );
                if ( isset( $script['data'] ) && is_array( $script['data'] ) ) {
                    wp_script_add_data( $script['data']['handle'], $script['data']['key'], $script['data']['value'] );
                }
                if ( isset( $script['localize'] ) && is_array( $script['localize'] ) ) {
                    wp_localize_script( $script['localize']['handle'], $script['localize']['name'], $script['localize']['l10n'] );
                }
                break;
        }
    }

    if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
        wp_enqueue_script( 'comment-reply' );
    }
}
endif; // your_themename_scripts
add_action( 'wp_enqueue_scripts', 'your_themename_scripts', 0 );
