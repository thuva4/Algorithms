# Histogram Equalization

## Overview

Histogram Equalization is a technique in image processing that adjusts the contrast of an image by redistributing the intensity values so that the output histogram is approximately uniform. It is one of the most widely used methods for contrast enhancement. The algorithm maps the original intensity distribution to a flatter distribution by using the cumulative distribution function (CDF) as a transformation function. This stretches the most frequent intensity values, effectively spreading out the pixel intensities across the full available range.

## How It Works

1. **Compute the histogram:** Count the frequency of each intensity level (0 to L-1, where L is the number of possible levels, typically 256 for 8-bit images).
2. **Compute the CDF:** Calculate the cumulative distribution function from the histogram. CDF(i) = sum of histogram[0] through histogram[i].
3. **Normalize the CDF:** Map the CDF values to the output range using the formula: `output(v) = round((CDF(v) - CDF_min) / (total_pixels - CDF_min) * (L - 1))`, where CDF_min is the minimum non-zero CDF value.
4. **Map the pixels:** Replace each pixel's intensity with the corresponding equalized value from the mapping.

## Example

Given a 4x4 image with 8 intensity levels (0-7):

```
Original image:
5 3 3 2
4 3 2 1
5 4 3 0
7 6 5 4
```

**Step 1 -- Histogram:**

| Intensity | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|-----------|---|---|---|---|---|---|---|---|
| Count     | 1 | 1 | 2 | 4 | 3 | 3 | 1 | 1 |

**Step 2 -- CDF:**

| Intensity | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|-----------|---|---|---|---|---|---|---|---|
| CDF       | 1 | 2 | 4 | 8 | 11| 14| 15| 16|

**Step 3 -- Equalized values:** Using `round((CDF(v) - 1) / (16 - 1) * 7)`:

| Intensity | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|-----------|---|---|---|---|---|---|---|---|
| Mapped    | 0 | 0 | 1 | 3 | 5 | 6 | 7 | 7 |

**Step 4 -- Equalized image:**

```
6 3 3 1
5 3 1 0
6 5 3 0
7 7 6 5
```

## Pseudocode

```
function histogramEqualization(image, L):
    // Step 1: Compute histogram
    histogram = array of size L, initialized to 0
    for each pixel p in image:
        histogram[p] = histogram[p] + 1

    // Step 2: Compute CDF
    cdf = array of size L
    cdf[0] = histogram[0]
    for i from 1 to L - 1:
        cdf[i] = cdf[i - 1] + histogram[i]

    // Step 3: Compute CDF_min (first non-zero CDF value)
    cdf_min = first non-zero value in cdf
    total_pixels = width * height of image

    // Step 4: Create mapping
    mapping = array of size L
    for i from 0 to L - 1:
        mapping[i] = round((cdf[i] - cdf_min) / (total_pixels - cdf_min) * (L - 1))

    // Step 5: Apply mapping
    for each pixel p in image:
        output[p] = mapping[p]

    return output
```

## Complexity Analysis

| Case    | Time         | Space |
|---------|-------------|-------|
| Best    | O(n + L)    | O(L)  |
| Average | O(n + L)    | O(L)  |
| Worst   | O(n + L)    | O(L)  |

Where n is the total number of pixels and L is the number of intensity levels (typically 256).

**Why these complexities?**

- **Time -- O(n + L):** Computing the histogram requires one pass over all n pixels. Computing the CDF and mapping requires O(L) operations. Applying the mapping requires another pass over all n pixels. Total: O(n + L).

- **Space -- O(L):** The algorithm requires arrays for the histogram, CDF, and mapping, each of size L. For 8-bit images, L = 256, so space is effectively constant.

## Applications

- **Medical imaging:** Enhancing X-ray, CT, and MRI scans to make features more visible for diagnosis.
- **Satellite imagery:** Improving contrast in remote sensing images that may have narrow intensity ranges due to atmospheric conditions.
- **Photography:** Automatic contrast adjustment in camera software and photo editors.
- **Computer vision preprocessing:** Normalizing image intensity before feature extraction or object detection.
- **Document scanning:** Improving readability of scanned documents with poor contrast.

## When NOT to Use

- **When uniform contrast is undesirable:** Histogram equalization can over-enhance noise in homogeneous regions and wash out fine details.
- **Color images without care:** Applying equalization independently to each RGB channel can shift colors. Use HSV or LAB color space and equalize only the luminance channel.
- **Images with bimodal histograms:** The algorithm may not produce good results when the histogram has two sharp peaks. Adaptive histogram equalization (CLAHE) is often better in such cases.
- **When preserving the original brightness is important:** Equalization changes the overall brightness of the image.

## Comparison

| Method | Adaptivity | Artifacts | Complexity | Notes |
|--------|-----------|-----------|------------|-------|
| Histogram Equalization | Global | Possible over-enhancement | O(n + L) | Simple; single transformation |
| CLAHE | Local | Controlled by clip limit | O(n * m) | Better for non-uniform lighting |
| Gamma Correction | Global | Minimal | O(n) | Requires manual gamma parameter |
| Linear Stretching | Global | Minimal | O(n) | Only stretches to full range |

## References

- Gonzalez, R. C., & Woods, R. E. (2018). *Digital Image Processing* (4th ed.). Pearson. Chapter 3: Intensity Transformations and Spatial Filtering.
- [Histogram Equalization -- Wikipedia](https://en.wikipedia.org/wiki/Histogram_equalization)
- Pizer, S. M., et al. (1987). "Adaptive Histogram Equalization and Its Variations." *Computer Vision, Graphics, and Image Processing*, 39(3), 355-368.
