<?php

namespace App\Entity;

use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;

/**
 * @ORM\Entity(repositoryClass="App\Repository\StockRepository")
 * @ApiResource
 */
class Stock
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"product", "stock", "variant"})
     */
    private $id;

    /**
     * @ORM\Column(type="float")
     * @Groups({"product", "stock", "variant"})
     */
    private $quantity;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\Variant", inversedBy="stock", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"stock"})
     */
    private $product;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getQuantity(): ?float
    {
        return $this->quantity;
    }

    public function setQuantity(float $quantity): self
    {
        $this->quantity = $quantity;

        return $this;
    }

    public function getProduct(): ?Variant
    {
        return $this->product;
    }

    public function setProduct(Variant $product): self
    {
        $this->product = $product;

        return $this;
    }
}
