  #!/usr/bin/perl
use strict;
use warnings;
my @array = ( 5, 6, 3, 1, 7, 3, 2, 9, 10, 4 );

for my $i ( 1 .. $#array ) {
    for my $k ( 0 .. $i - 1 ) {
        @array[ $k, $k + 1 ] = @array[ $k + 1, $k ]
            if $array[$k] > $array[ $k + 1 ];
    }
}

print "@array\n";