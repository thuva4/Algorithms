# Leaky Bucket

## Overview

The Leaky Bucket algorithm is a traffic shaping and rate limiting algorithm used in computer networks to control the rate at which data is transmitted. It models a bucket with a fixed capacity that leaks at a constant rate. Incoming packets are added to the bucket; if the bucket overflows (capacity exceeded), packets are dropped or queued. The bucket leaks (transmits) data at a steady, predetermined rate regardless of the burstiness of incoming traffic.

The algorithm smooths out bursty traffic into a steady stream, making it fundamental to quality of service (QoS) management in networks. It was originally described by Jonathan Turner in 1986 and is used in ATM networks, traffic policing, and API rate limiting.

## How It Works

1. **Initialize** the bucket with a fixed capacity (maximum burst size) and a constant leak rate (output rate).
2. **For each incoming packet:**
   a. **Leak** the bucket: Compute how much data has leaked since the last packet arrived (based on elapsed time and leak rate). Reduce the current bucket level accordingly (minimum 0).
   b. **Check capacity:** If adding the packet to the bucket would exceed capacity, the packet is **rejected** (dropped or queued).
   c. **Accept:** If the bucket has room, add the packet size to the current bucket level and transmit it at the constant leak rate.
3. **Output** is always at a constant rate, regardless of how bursty the input is.

The bucket level represents the amount of data buffered. The leak represents steady transmission. When the bucket is full, excess traffic is discarded, enforcing the rate limit.

## Worked Example

**Parameters:** Bucket capacity = 10 units, Leak rate = 1 unit/second

**Incoming packets:**

| Time (s) | Packet Size | Bucket Before Leak | Leaked Since Last | Bucket After Leak | Bucket After Add | Action |
|----------|------------|--------------------|--------------------|-------------------|-----------------|--------|
| 0 | 4 | 0 | 0 | 0 | 4 | Accept |
| 1 | 3 | 4 | 1 | 3 | 6 | Accept |
| 2 | 5 | 6 | 1 | 5 | 10 | Accept (exactly full) |
| 3 | 3 | 10 | 1 | 9 | 12 > 10 | Reject (overflow) |
| 5 | 2 | 9 | 2 | 7 | 9 | Accept |
| 10 | 8 | 9 | 5 | 4 | 12 > 10 | Reject (overflow) |
| 15 | 6 | 4 | 5 | 0 | 6 | Accept |

**Result:** 4 packets accepted, 2 packets rejected. Output stream is smooth at 1 unit/second.

## Pseudocode

```
class LeakyBucket:
    capacity     // Maximum bucket size (burst tolerance)
    leakRate     // Constant output rate (units per second)
    currentLevel // Current amount of data in the bucket
    lastTime     // Timestamp of last operation

function initialize(capacity, leakRate):
    this.capacity = capacity
    this.leakRate = leakRate
    this.currentLevel = 0
    this.lastTime = currentTime()

function processPacket(packetSize):
    now = currentTime()
    elapsed = now - lastTime
    lastTime = now

    // Leak the bucket
    leaked = elapsed * leakRate
    currentLevel = max(0, currentLevel - leaked)

    // Check if packet fits
    if currentLevel + packetSize > capacity:
        return REJECT   // Packet dropped

    // Accept packet
    currentLevel += packetSize
    return ACCEPT

function processAllPackets(packets):
    accepted = 0
    rejected = 0
    for each packet in packets:
        if processPacket(packet.size) == ACCEPT:
            accepted += 1
        else:
            rejected += 1
    return (accepted, rejected)
```

## Complexity Analysis

| Case    | Time | Space |
|---------|------|-------|
| Best    | O(n) | O(1)  |
| Average | O(n) | O(1)  |
| Worst   | O(n) | O(1)  |

Where n is the number of incoming packets.

- **Time -- O(n):** Each packet is processed in O(1) time (a constant number of arithmetic operations for leaking and capacity checking).
- **Space -- O(1):** Only the bucket level, last timestamp, capacity, and leak rate need to be stored, regardless of the number of packets.

## When to Use

- **Network traffic shaping:** Smoothing bursty network traffic into a constant-rate output stream (used in ATM networks, ISPs).
- **API rate limiting:** Limiting the number of API calls a client can make per time window (common in web services).
- **Quality of Service (QoS):** Enforcing bandwidth limits on network connections to ensure fair resource sharing.
- **Congestion control:** Preventing network congestion by limiting the transmission rate of individual sources.
- **Logging and monitoring:** Throttling log output or alert generation to prevent flooding during high-activity periods.

## When NOT to Use

- **Bursty traffic tolerance needed:** The leaky bucket strictly smooths output to a constant rate, discarding bursts that exceed the bucket capacity. If short bursts should be allowed (up to some limit), the **Token Bucket** algorithm is better -- it permits bursts up to the token accumulation limit.
- **Variable rate requirements:** If the output rate needs to vary based on network conditions (adaptive rate control), the leaky bucket's fixed leak rate is too rigid.
- **Precision timing not available:** The algorithm depends on accurate timekeeping. In environments where clock resolution is poor, the leak calculation becomes imprecise.
- **Need to queue rather than drop:** The basic leaky bucket drops excess packets. If all packets must eventually be delivered (even if delayed), a queue-based approach with backpressure is more appropriate.
- **Fairness across many flows:** A single leaky bucket per flow does not inherently provide fairness across multiple competing flows. Weighted fair queuing (WFQ) or similar algorithms are needed.

## Comparison

| Algorithm | Burst Handling | Output Rate | Use Case |
|-----------|---------------|-------------|----------|
| Leaky Bucket (this) | Drops excess, smooths to constant rate | Constant | Strict traffic shaping |
| Token Bucket | Allows bursts up to accumulated tokens | Variable (up to burst limit) | Rate limiting with burst tolerance |
| Fixed Window Counter | Counts requests per fixed window | Varies within window | Simple API rate limiting |
| Sliding Window Log | Tracks timestamps of each request | Varies | Precise API rate limiting |
| Sliding Window Counter | Hybrid of fixed window and sliding | Varies | Efficient approximate rate limiting |

The leaky bucket and token bucket are the two most important rate-limiting algorithms. The key difference is that the leaky bucket enforces a strictly constant output rate, while the token bucket allows temporary bursts (up to the token limit) followed by a sustained rate. For strict traffic shaping, use the leaky bucket. For rate limiting that tolerates bursts, use the token bucket. For web API rate limiting, sliding window approaches are often simpler to implement and sufficient.

## Implementations

| Language | File |
|----------|------|
| C        | [leaky_bucket.c](c/leaky_bucket.c) |

## References

- Turner, J. S. (1986). "New directions in communications (or which way to the information age?)." *IEEE Communications Magazine*, 24(10), 8-15.
- Tanenbaum, A. S., & Wetherall, D. J. (2011). *Computer Networks* (5th ed.). Pearson. Chapter 5: The Network Layer.
- Kurose, J. F., & Ross, K. W. (2017). *Computer Networking: A Top-Down Approach* (7th ed.). Pearson. Chapter 7: Multimedia Networking.
- [Leaky bucket -- Wikipedia](https://en.wikipedia.org/wiki/Leaky_bucket)
