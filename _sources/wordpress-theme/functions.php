<?php
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
/**
 * WordPress theme functions.
 *
 * @package WordPress
 * @subpackage VisuAlive
 * @author YOUR NAME <hello@email.address>
 *
 *
 * Copyright (C) 2015 YOUR NAME.
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

/**
 * Autoloader.
 */
spl_autoload_register( function( $class_name ) {
	$_class_name = str_replace( array( 'VISUALIVE', 'CHERRYBLOSSOM', '_'), array( 'class', 'class', '-' ), $class_name );
	$path        = __DIR__ . DIRECTORY_SEPARATOR . 'incs' . DIRECTORY_SEPARATOR . mb_strtolower( $_class_name ) . '.php';

	if ( file_exists( $path ) ) {
		require_once $path;
	}
} );

/**
 * Theme sets up.
 */
if ( !function_exists( 'yourthemeslug_setup' ) ) :
	function yourthemeslug_setup() {
		if ( !class_exists( 'YOURTHEMESLUG' ) ) {
			class YOURTHEMESLUG extends VISUALIVE_THEME_SETUP {
				protected function __construct() {
					parent::__construct();
				}
			}
		}

		$cherryblossom = YOURTHEMESLUG::instance();
	}
endif; // cherryblossom_setup
add_action( 'after_setup_theme', 'yourthemeslug_setup', 99999 );
