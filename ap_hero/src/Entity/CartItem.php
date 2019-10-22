<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\CartItemRepository")
 */
class CartItem
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Variant")
     * @ORM\JoinColumn(nullable=false)
     */
    private $product;

    /**
     * @ORM\Column(type="float")
     */
    private $quantity;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Cart", inversedBy="cartItems" , cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=true)
     */
	private $cart;

	/**
     * @ORM\ManyToOne(targetEntity="App\Entity\Orders", inversedBy="cartItems" , cascade={"persist"})
     * @ORM\JoinColumn(nullable=true)
     */
    private $orders;

    /**
     * @ORM\Column(type="boolean")
     */
    private $isPaid;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getProduct(): ?Variant
    {
        return $this->product;
    }

    public function setProduct(?Variant $product): self
    {
        $this->product = $product;

        return $this;
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

    public function getCart(): ?Cart
    {
        return $this->cart;
    }

    public function setCart(?Cart $cart): self
    {
        $this->cart = $cart;

        return $this;
    }

    public function getIsPaid(): ?bool
    {
        return $this->isPaid;
    }

    public function setIsPaid(bool $isPaid): self
    {
        $this->isPaid = $isPaid;

        return $this;
    }

    public function getOrder(): ?Orders
    {
        return $this->orders;
    }

    public function setOrder(?Cart $orders): self
    {
        $this->orders = $orders;

        return $this;
    }
}
