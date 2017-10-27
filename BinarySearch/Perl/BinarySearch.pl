#!/usr/bin/perl

$item = 'd'; #item to find
@array = ( 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h' ); #sorted array
                                        
$index = binary_search(\@array, $item); #run search

if (defined $index) { print "$item occurs at position $index.\n" }
else                { print "$item doesn't occur.\n" }

sub binary_search {
    my ($array, $word) = @_;
    my $low = 0;
    my $high = @$array - 1;

    while ( $low <= $high ) {
        my $try = int( ($low+$high) / 2 );
        $low  = $try+1, next if $array->[$try] lt $word;
        $high = $try-1, next if $array->[$try] gt $word;
        return $try;
    }
    return;
}
