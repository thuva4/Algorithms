#!/usr/bin/env perl

use strict;
use warnings;
use integer;

# populate the array with the integers from 0 to 100
my @array = ( 0 ... 100 );

# prompt the user for a search key
my $searchKey = '';
print 'Enter an integer search key: ';
chomp ( $searchKey = <STDIN> );

my $left  = 0;
my $right = scalar @array - 1;
my $found = 0;
my $mid;

while ( ($left + 1) < $right )
{
    $mid = $left + ($right - $left) / 2;

    if ( $array[$mid] == $searchKey ) {
        $found = 1;
        last;
    }

    if ( $searchKey < $array[$mid] ) {
        $right = $mid;
    } else {
        $left = $mid;
    }
}

if ( $found ) {
    print "Found $searchKey at $mid \n";
} else {
    print "$searchKey not found \n";
}

exit 0;
