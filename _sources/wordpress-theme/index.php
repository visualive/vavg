<?php get_header(); ?>

<?php if ( have_posts() ) :?>
<div class="row">
    <?php while ( have_posts() ): the_post(); ?>
    <div <?php post_class( 'entry' ); ?>>
        <article class="small-12 columns">
            <header class="entry_header">
                <h1 class="entry_header_text"><?php the_title(); ?></h1>
            </header>
            <div class="entry_body">
                <?php the_content(); ?>
            </div>
        </article>
    </div>
    <?php endwhile; ?>
</div>
<?php endif; ?>

<?php get_footer(); ?>
