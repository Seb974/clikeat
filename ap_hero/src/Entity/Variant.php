<?php

namespace App\Entity;

use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;

/**
 * @ORM\Entity(repositoryClass="App\Repository\VariantRepository")
 * @ApiResource(subresourceOperations={
 *     "api_products_variant_get_subresource"={
 *         "method"="GET",
 *         "normalization_context"={"groups"={"product"}}
 *     }
 * })
 */
class Variant
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"product", "variant"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=60)
     * @Groups({"product", "variant"})
     */
    private $name;

    /**
     * @ORM\Column(type="float")
     * @Groups({"product", "variant"})
     */
    private $price;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\Stock", mappedBy="product", cascade={"persist", "remove"})
     * @Groups({"product", "variant"})
     * @ApiSubresource
     */
    private $stock;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Product", inversedBy="variants", cascade={"persist"})
     * @ORM\JoinColumn(nullable=true)
     * @Groups({"variant"})
     * 
     */
    private $product;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Tva")
     * @Groups({"product", "variant"})
     * @ApiSubresource
     */
    private $tva;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(float $price): self
    {
        $this->price = $price;

        return $this;
    }

    public function getStock(): ?Stock
    {
        return $this->stock;
    }

    public function setStock(Stock $stock): self
    {
        $this->stock = $stock;

        // set the owning side of the relation if necessary
        if ($this !== $stock->getProduct()) {
            $stock->setProduct($this);
        }
        return $this;
    }

    public function getProduct(): ?Product
    {
        return $this->product;
    }

    public function setProduct(?Product $product): self
    {
        $this->product = $product;

        return $this;
    }

    public function getTva(): ?Tva
    {
        return $this->tva;
    }

    public function setTva(?Tva $tva): self
    {
        $this->tva = $tva;

        return $this;
    }
}
