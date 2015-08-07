<?php
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
/**
 * WordPress theme bootstrap
 * This file will works as bootstrap.
 *
 * @package WordPress
 * @subpackage Your theme name
 * @author Your name <Your@email.address>
 *
 *
 * Copyright (C) 2015  Your name.
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
    $_class_name = str_replace( array( 'VISUALIVE', 'YOURTHEMENAME', '_'), array( 'class', 'class', '-' ), $class_name );
    $path        = __DIR__ . DIRECTORY_SEPARATOR . 'incs' . DIRECTORY_SEPARATOR . mb_strtolower( $_class_name ) . '.php';

    if ( file_exists( $path ) ) {
        require_once $path;
    }
} );

if ( !function_exists( 'yourthemename_setup' ) ) :
    /**
     * Theme sets up.
     */
    function yourthemename_setup() {
        if ( !class_exists( 'YOURTHEMENAME' ) ) {
            class YOURTHEMENAME extends VISUALIVE_THEME_SETUP {
                protected function __construct() {
                    parent::__construct();
                }
            }
        }

        $yourthemename = YOURTHEMENAME::instance();
    }
endif; // yourthemename_setup
add_action( 'after_setup_theme', 'yourthemename_setup', 99999 );