<?php
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
/**
 * WordPress theme define class.
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

class VISUALIVE_THEME_DEFINE extends VISUALIVE_SINGLETON {
	/**
	 * テーマのバージョン
	 *
	 * @var string
	 */
	public $version;

	/**
	 * テーマ名
	 *
	 * @var string
	 */
	public $name;

	/**
	 * テーマディレクトリのURL
	 *
	 * @var string
	 */
	public $uri = '';

	/**
	 * テーマディレクトリのパス
	 *
	 * @var string
	 */
	public $path = '';


	/**
	 * テキストドメイン
	 *
	 * @var string
	 */
	public $text_domain;

	/**
	 * ランゲージファイルのパス
	 *
	 * @var string
	 */
	public $domain_path = '';

	/**
	 * This hook is called once any activated themes have been loaded.
	 */
	protected function __construct( $settings = array() ) {
		$theme             = get_file_data( STYLESHEETPATH . '/style.css', array( 'name' => 'Theme Name', 'version' => 'Version', 'text_domain' => 'Text domain', 'domain_path' => 'Domain path' ), 'theme' );
		$this->version     = $theme['version'];
		$this->name        = $theme['name'];
		$this->uri         = get_stylesheet_directory_uri();
		$this->path        = get_stylesheet_directory();
		$this->text_domain = $theme['text_domain'];
		$this->domain_path = $theme['domain_path'];
	}
}
