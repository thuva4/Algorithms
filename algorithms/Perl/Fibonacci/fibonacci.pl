#!/usr/bin/env perl

use strict;
use warnings;

# usage: perl fibonacci.pl <number>
print fibonacci($ARGV[0]);

sub fibonacci {
    my $n = shift;

    return $n if $n < 2;
    return fibonacci($n-1) + fibonacci($n-2);
}

exit 0;
