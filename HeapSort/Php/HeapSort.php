<?php

$heap = new SplMinHeap;

foreach ([5, 6, 7, 8, 1, 2, 12, 14] as $item) {
    $heap->insert($item);
}

echo implode(',', iterator_to_array($heap));
