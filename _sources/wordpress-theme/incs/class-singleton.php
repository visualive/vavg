<?php
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
/**
 * WordPress theme singleton class.
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

abstract class VISUALIVE_SINGLETON {
	/**
	 * Holds the singleton instance of this class
	 *
	 * @var array
	 */
	private static $instances = array();

	/**
	 * Instance
	 *
	 * @param  array $settings
	 * @return self
	 */
	public static function instance( $settings = array() ){
		$class_name = get_called_class();
		if( !isset( self::$instances[$class_name] ) ) {
			self::$instances[$class_name] = new $class_name( $settings );
		}

		return self::$instances[$class_name];
	}

	/**
	 * This hook is called once any activated themes have been loaded.
	 */
	protected function __construct( $settings = array() ) {}
}
