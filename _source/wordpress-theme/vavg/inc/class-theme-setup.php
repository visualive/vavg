<?php
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
/**
 * WordPress theme setup class.
 *
 * @package WordPress
 * @subpackage VisuAlive
 * @author KUCKLU <kuck1u@visualive.jp>
 *
 *
 * Copyright (C) 2015  KUCKLU and VisuAlive.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * It is also available through the world-wide-web at this URL:
 * http://www.gnu.org/licenses/gpl-2.0.txt
 */

class VISUALIVE_THEME_SETUP extends VISUALIVE_SINGLETON {
	/**
	 * テーマ情報
	 *
	 * @var object
	 */
	protected $theme = null;

	/**
	 * Feeds
	 *
	 * @var array
	 */
	protected $feeds = array();

	/**
	 * Sets up theme defaults and registers support for various WordPress features.
	 * Note that this function is hooked into the after_setup_theme hook, which
	 * runs before the init hook. The init hook is too late for some features, such
	 * as indicating support for post thumbnails.
	 *
	 * @since CherryBlossom 1.0.0
	 */
	protected function __construct( $settings = array() ) {
		$this->theme = VISUALIVE_THEME_DEFINE::instance();
		$this->feeds = array( 'rss2_head', 'commentsrss2_head', 'rss_head', 'rdf_header', 'atom_head', 'comments_atom_head', 'opml_head', 'app_head' );

		/**
		 * Remove emoji scripts.
		 */
		remove_action( 'wp_head',             'print_emoji_detection_script', 7 );
		remove_action( 'admin_print_scripts', 'print_emoji_detection_script'    );
		remove_action( 'wp_print_styles',     'print_emoji_styles'              );
		remove_action( 'admin_print_styles',  'print_emoji_styles'              );
		remove_filter( 'the_content_feed',    'wp_staticize_emoji'              );
		remove_filter( 'comment_text_rss',    'wp_staticize_emoji'              );
		remove_filter( 'wp_mail',             'wp_staticize_emoji_for_email'    );

		/**
		 * Remove actions.
		 */
		foreach ( $this->feeds as $feed ) {
			remove_action( $feed, 'the_generator' );
		}
		remove_action( 'wp_head',           'wp_generator'                       );
		remove_action( 'wp_head',           'rsd_link'                           );
		remove_action( 'wp_head',           'wlwmanifest_link'                   );
		remove_action( 'wp_head',           'parent_post_rel_link'               );
		remove_action( 'wp_head',           'start_post_rel_link'                );
		remove_action( 'wp_head',           'adjacent_posts_rel_link_wp_head'    );
		remove_action( 'wp_head',           'wp_shortlink_wp_head'               );
		remove_action( 'template_redirect', 'wp_shortlink_header',            11 );
		remove_action( 'wp_head',           'jetpack_og_tags'                    );

		/**
		 * Add default posts and comments RSS feed links to head.
		 */
		add_action( 'wp', function () {
			if ( is_single() || is_home() ) {
				add_theme_support( 'automatic-feed-links' );
			}
			if ( is_page() ) {
				remove_action( 'wp_head', 'feed_links_extra', 3 );
			}
		} );

		/**
		 * Define content width var
		 */
		global $content_width;
		$content_width = 745;

		/**
		 * Let WordPress manage the document title.
		 * By adding theme support, we declare that this theme does not use a
		 * hard-coded <title> tag in the document head, and expect WordPress to
		 * provide it for us.
		 */
		add_theme_support( 'title-tag' );

		/**
		 * Enable support for Post Thumbnails on posts and pages.
		 * See: https://codex.wordpress.org/Function_Reference/add_theme_support#Post_Thumbnails
		 */
		add_theme_support( 'post-thumbnails' );

		/**
		 * This theme supports all available post formats by default.
		 * See https://codex.wordpress.org/Post_Formats
		 */
		add_theme_support( 'post-formats', array( 'aside', 'audio', 'chat', 'gallery', 'image', 'link', 'quote', 'status', 'video' ) );

		/**
		 * Switches default core markup for search form, comment form,
		 * and comments to output valid HTML5.
		 */
		add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption' ) );

		/**
		 * This theme styles the visual editor to resemble the theme style,
		 * specifically font, colors, icons, and column width.
		 */
		add_editor_style( 'editor-style.min.css' );

		/**
		 * Change front page title.
		 */
		add_filter( 'wp_title', array( &$this, 'wp_title' ), 0, 3 );

		/**
		 * Enqueue scripts and styles.
		 */
		add_action( 'wp_enqueue_scripts', array( &$this, 'wp_enqueue_scripts' ), 0    );
		add_filter( 'style_loader_src',   array( &$this, 'script_loader_src' ),  1000 );
		add_filter( 'script_loader_src',  array( &$this, 'script_loader_src' ),  1000 );

		/**
		 * Retrieve the classes for the html element as an array.
		 */
		add_filter( 'body_class',    array( &$this, 'body_class' )                  );
		add_filter( 'comment_class', array( &$this, 'remove_comment_author_class' ) );

		/**
		 * Change the email address to send from
		 * and the name to associate with the "from" email address.
		 */
		add_filter( 'wp_mail_from',      array( &$this, 'wp_mail_from' )      );
		add_filter( 'wp_mail_from_name', array( &$this, 'wp_mail_from_name' ) );

		/**
		 * Display OGp prefix.
		 */
		add_filter( 'language_attributes', function ( $output ) {
			return str_replace( ' prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb#"', ' prefix="' . self::get_ogp_prefix() . '"', $output );
		}, 99 );

		/**
		 * Remove All Yoast HTML Comments
		 * https://gist.github.com/paulcollett/4c81c4f6eb85334ba076
		 */
		if (defined('WPSEO_VERSION')){
			add_action('get_header',function (){ ob_start(function ($o){
				return preg_replace('/\n?<.*?yoast.*?>/mi','',$o); }); });
			add_action('wp_head',function (){ ob_end_flush(); }, 999);
		}
	}

	/**
	 * Display OGp prefix.
	 *
	 * @param  bool|true $echo
	 * @return string
	 */
	function get_ogp_prefix() {
		$namespace[] = 'og:http://ogp.me/ns#';
		$namespace[] = 'fb:http://ogp.me/ns/fb#';

		if ( is_single() || (is_page() && !is_front_page() ) ) {
			$namespace[] = 'article:http://ogp.me/ns/article#';
		} else {
			$namespace[] = 'website:http://ogp.me/ns/website#';
		}

		$result = implode( ' ', $namespace );

		return $result;
	}

	/**
	 * Change the email address to send from.
	 */
	public function wp_mail_from() {
		return get_bloginfo( 'admin_email' );
	}

	/**
	 * Change the name to associate with the "from" email address.
	 */
	public function wp_mail_from_name() {
		return get_bloginfo( 'name' );
	}

	/**
	 * Change front page title.
	 *
	 * @param string $title       Page title.
	 * @param string $sep         Title separator.
	 * @param string $seplocation Location of the separator (left or right).
	 *
	 * @return string
	 */
	public function wp_title( $title, $sep, $seplocation ) {
		if ( ( is_front_page() && is_page() ) || ( is_front_page() && is_home() ) ) {
			$title = get_bloginfo( 'name', 'display' );
		} elseif ( is_home() && !is_front_page() ) {
			$title = single_post_title( '', false ) . " $sep " . get_bloginfo( 'name', 'display' );
		}

		return $title;
	}

	/**
	 * Enqueue scripts and styles.
	 *
	 * @since CherryBlossom 1.0.0
	 */
	public function wp_enqueue_scripts() {
		$suffix  = ( !defined( 'WP_DEBUG' ) || ( defined( 'WP_DEBUG' ) && !WP_DEBUG ) ) ? '.min' : '' ;
		$scripts = array(
			array(
				'handle' => $this->theme->name,
				'src'    => $this->theme->uri . '/style' . $suffix . '.css',
				'deps'   => array(),
				'ver'    => $this->theme->version,
			),
			array(
				'handle'    => $this->theme->name,
				'src'       => $this->theme->uri . '/assets/js/script' . $suffix . '.js',
				'deps'      => array( 'jquery' ),
				'ver'       => $this->theme->version,
				'in_footer' => true
			),
			array(
				'handle'    => $this->theme->name . '-ie',
				'src'       => $this->theme->uri . '/assets/js/ie' . $suffix . '.js',
				'deps'      => array( $this->theme->name ),
				'ver'       => $this->theme->version,
				'in_footer' => false,
				'data'      => array(
					'handle' => $this->theme->name . '-ie',
					'key'    => 'conditional',
					'value'  => 'lt IE 9'
				)
			)
		);

		/**
		 * Load our framework stylesheet and javascript.
		 */
		foreach ( $scripts as $script ) {
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

		/**
		 * Load enqueued scripts in the Footer.
		 */
		if ( !is_admin() ) {
			remove_action( 'wp_head', 'wp_print_scripts'         );
			remove_action( 'wp_head', 'wp_print_head_scripts', 9 );
			remove_action( 'wp_head', 'wp_enqueue_scripts',    1 );
			add_action( 'wp_footer',  'wp_print_head_scripts', 5 );
			add_action( 'wp_footer',  'wp_print_scripts',      5 );
			add_action( 'wp_footer',  'wp_enqueue_scripts',    1 );
		}
	}

	/**
	 * head 内に出力される link and script タグからバージョン情報を削除する
	 *
	 * @return string
	 */
	public function script_loader_src( $src ) {
		$str = 'ver=';

		if ( !is_admin() && strpos( $src, $str ) ) {
			$src = remove_query_arg( 'ver', $src );
		}
		return $src;
	}

	/**
	 * Retrieve the classes for the body element as an array.
	 *
	 * @param string|array $class One or more classes to add to the class list.
	 * @return array Array of classes.
	 */
	public function body_class() {
		global $wp_query;

		$classes = array();

		if ( is_single() || is_page() ) {
			$post_id = $wp_query->get_queried_object_id();
		} else {
			$post_id = 0;
		}

		if ( is_single() || is_page() || is_archive() ) {
			$object = $wp_query->get_queried_object();
		} else {
			$object = null;
		}

		if ( is_rtl() ) {
			$classes[] = 'rtl';
		}

		if ( is_front_page() ) {
			$classes[] = 'home';
		}
		if ( is_home() ) {
			$classes[] = 'blog';
		}
		if ( is_archive() ) {
			$classes[] = 'archive';
		}
		if ( is_date() ) {
			$classes[] = 'date';
		}
		if ( is_search() ) {
			$classes[] = 'search';
			$classes[] = $wp_query->posts ? 'search-results' : 'search-noResults';
		}
		if ( is_paged() ) {
			$classes[] = 'paged';
		}
		if ( is_attachment() ) {
			$classes[] = 'attachment';
		}
		if ( is_404() ) {
			$classes[] = 'error404';
		}

		if ( is_single() ) {
			$classes[] = 'single';

			if ( isset( $object->post_type ) ) {
				if ( 'post' !== $object->post_type ) {
					$classes[] = 'single-' . sanitize_html_class( $object->post_type, $post_id );
				}

				// Post Format
				if ( post_type_supports( $object->post_type, 'post-formats' ) ) {
					$post_format = get_post_format( $object->ID );

					if ( $post_format && !is_wp_error( $post_format ) ) {
						$classes[] = 'single-format-' . sanitize_html_class( $post_format );
					}
				}
			}

			if ( is_attachment() ) {
				$mime_type   = get_post_mime_type( $post_id );
				$mime_prefix = array( 'application/', 'image/', 'text/', 'audio/', 'video/', 'music/' );
				$classes[]   = 'attachment-' . str_replace( $mime_prefix, '', $mime_type );
			}
		} elseif ( is_archive() ) {
			if ( is_post_type_archive() ) {
				$post_type = get_query_var( 'post_type' );
				if ( is_array( $post_type ) ) {
					$post_type = reset( $post_type );
				}
				$classes[] = 'archive-' . sanitize_html_class( $post_type );
			} elseif ( is_author() ) {
				$classes[] = 'author';
			} elseif ( is_category() ) {
				$classes[] = 'category';
				if ( isset( $object->term_id ) ) {
					$cat_class = sanitize_html_class( $object->slug, $object->term_id );
					if ( is_numeric( $cat_class ) || !trim( $cat_class, '-' ) ) {
						$cat_class = $object->term_id;
					}

					$classes[] = 'category-' . $cat_class;
				}
			} elseif ( is_tag() ) {
				$classes[] = 'tag';
				if ( isset( $object->term_id ) ) {
					$tag_class = sanitize_html_class( $object->slug, $object->term_id );
					if ( is_numeric( $tag_class ) || !trim( $tag_class, '-' ) ) {
						$tag_class = $object->term_id;
					}

					$classes[] = 'tag-' . $tag_class;
				}
			} elseif ( is_tax() ) {
				if ( isset( $object->term_id ) ) {
					$term_class = sanitize_html_class( $object->slug, $object->term_id );
					if ( is_numeric( $term_class ) || !trim( $term_class, '-' ) ) {
						$term_class = $object->term_id;
					}

					$classes[] = 'tax-' . sanitize_html_class( $object->taxonomy );
					$classes[] = 'term-' . $term_class;
				}
			}
		} elseif ( is_page() ) {
			$classes[] = 'page';

			if ( is_page_template() ) {
				$template_slug  = get_page_template_slug( $post_id );
				$template_parts = explode( '/', $template_slug );

				foreach ( (array)array_pop( $template_parts ) as $part ) {
					$classes[] = 'page-layout-' . sanitize_html_class( str_replace( array( '.', '/', '-' ), '', basename( $part, '.php' ) ) );
				}
			}
		}

		if ( is_user_logged_in() ) {
			$classes[] = 'logged-in';
		}

		if ( is_admin_bar_showing() ) {
			$classes[] = 'admin-bar';
			$classes[] = 'no-customize-support';
		}

		if ( !empty( $class ) ) {
			if ( !is_array( $class ) ) {
				$class = preg_split( '#\s+#', $class );
			}
			$classes = array_merge( $classes, $class );
		} else {
			// Ensure that we always coerce class to being an array.
			$class = array();
		}

		$classes = array_map( 'esc_attr', $classes );

		/**
		 * Filter the list of CSS body classes for the current post or page.
		 *
		 * @param array  $classes An array of body classes.
		 * @param string $class   A comma-separated list of additional classes added to the body.
		 */
		$classes = apply_filters( $this->theme->text_domain . '_body_class', $classes, $class );

		return array_unique( $classes );
	}

	/**
	 * Remove admin name in comments class
	 *
	 * @link http://www.wprecipes.com/wordpress-hack-remove-admin-name-in-comments-class Documentation
	 */
	public function remove_comment_author_class( $classes ) {
		foreach( $classes as $key => $class ) {
			if(strstr($class, "comment-author-")) {
				unset( $classes[$key] );
			}
		}

		return $classes;
	}
}
