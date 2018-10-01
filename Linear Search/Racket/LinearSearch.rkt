(define (linear-search number num-list)
  (if (member number num-list)
      (get-num-index number num-list 0)
      -1))

(define (get-num-index number num-list index)
  (if (= number (first num-list))
      index
      (get-num-index number (rest num-list) (+ index 1))))
