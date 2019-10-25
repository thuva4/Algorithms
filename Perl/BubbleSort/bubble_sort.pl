#!/usr/bin/env perl

use strict;
use warnings;
no strict 'refs';

my @array = ( 5, 6, 3, 1, 7, 3, 2, 9, 10, 4 );

for my $i ( 1 .. $#array ) {
    for my $j ( 0 .. $#array - 1 ) {
        if ( $array[$j] > $array[ $j + 1 ]) {
            _swap(\$array[ $j ], \$array[ $j + 1 ]);
        }
    }
}

sub _swap {
    my ($n, $m) = @_;

    my $tmp = $$n;
    $$n = $$m;
    $$m = $tmp;
}

print "@array\n";

exit 0;
