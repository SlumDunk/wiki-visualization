<?php

/**
 *user entity
 */
class User
{
    /**
     * @var user name
     */
    public $username;
    /**
     * @var revtime
     */
    public $revtime;
    /**
     * @var page title
     */
    public $pagetitle;
    /**
     * @var isReverted
     */
    public $isReverted;
    /**
     * @var revertTime
     */
    public $revertTime;
    /**
     * @var color
     */
    public $color;

    public $pageCategory;

    function __construct($username, $revtime, $pagetitle, $isReverted, $revertTime, $color, $pageCategory)
    {
        $this->username = $username;
        $this->revtime = $revtime;
        $this->pagetitle = $pagetitle;
        $this->isReverted = $isReverted;
        $this->revertTime = $revertTime;
        $this->color = $color;
        $this->pageCategory = $pageCategory;
    }

}

?>
