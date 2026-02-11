$urls = @{
    "corporate.jpg" = "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop";
    "wellness.jpg"  = "https://images.unsplash.com/photo-1544367563-12123d896589?q=80&w=1200&auto=format&fit=crop";
    "caravan.jpg"   = "https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=1200&auto=format&fit=crop";
    "casual.jpg"    = "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1200&auto=format&fit=crop"
}

$dest = "c:\Users\Admin\Desktop\Jade_ReVamp\public\assets"

foreach ($name in $urls.Keys) {
    echo "Downloading $name..."
    $path = Join-Path $dest $name
    try {
        Invoke-WebRequest -Uri $urls[$name] -OutFile $path -UserAgent "Mozilla/5.0"
        echo "Saved to $path"
    } catch {
        echo "Failed to download $name : $_"
    }
}
