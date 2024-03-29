<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;

/**
 * @ORM\Entity(repositoryClass="App\Repository\OrderRepository")
 * @ApiResource
 */
class Orders
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=60)
     */
    private $payment_id;

    /**
     * @ORM\Column(type="string", length=60)
     */
    private $payment_type;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User")
     * @ORM\JoinColumn(nullable=false)
     * @ApiSubresource
     */
    private $user;

    /**
     * @ORM\Column(type="float")
     */
    private $totalToPay_TTC;

    /**
     * @ORM\Column(type="float")
     */
    private $totalToPay_HT;

    /**
     * @ORM\Column(type="float")
     */
    private $totalTax;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $orderStatus;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\CartItem", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     * @ApiSubresource
     */
    private $cartItem;

    /**
     * @ORM\Column(type="float")
     */
    private $taxRate;

    /**
     * @ORM\Column(type="string", length=64)
     */
    private $internalId;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Supplier")
     * @ORM\JoinColumn(nullable=false)
     * @ApiSubresource
     */
    private $supplier;

    /**
     * @ORM\Column(type="integer")
     */
    private $cartId;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $PayDateTime;

    public function __construct()
    {
        $this->cartItems = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPaymentId(): ?string
    {
        return $this->payment_id;
    }

    public function setPaymentId(string $payment_id): self
    {
        $this->payment_id = $payment_id;

        return $this;
    }

    public function getPaymentType(): ?string
    {
        return $this->payment_type;
    }

    public function setPaymentType(string $payment_type): self
    {
        $this->payment_type = $payment_type;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getTotalToPayTTC(): ?float
    {
        return $this->totalToPay_TTC;
    }

    public function setTotalToPayTTC(float $totalToPay_TTC): self
    {
        $this->totalToPay_TTC = $totalToPay_TTC;

        return $this;
    }

    public function getTotalToPayHT(): ?float
    {
        return $this->totalToPay_HT;
    }

    public function setTotalToPayHT(float $totalToPay_HT): self
    {
        $this->totalToPay_HT = $totalToPay_HT;

        return $this;
    }

    public function getTotalTax(): ?float
    {
        return $this->totalTax;
    }

    public function setTotalTax(float $totalTax): self
    {
        $this->totalTax = $totalTax;

        return $this;
    }

    public function getOrderStatus(): ?string
    {
        return $this->orderStatus;
    }

    public function setOrderStatus(string $orderStatus): self
    {
        $this->orderStatus = $orderStatus;

        return $this;
    }

    public function getCartItem(): ?CartItem
    {
        return $this->cartItem;
    }

    public function setCartItem(CartItem $cartItem): self
    {
        $this->cartItem = $cartItem;

        return $this;
    }

    public function getTaxRate(): ?float
    {
        return $this->taxRate;
    }

    public function setTaxRate(float $taxRate): self
    {
        $this->taxRate = $taxRate;

        return $this;
    }

    public function getInternalId(): ?string
    {
        return $this->internalId;
    }

    public function setInternalId(string $internalId): self
    {
        $this->internalId = $internalId;

        return $this;
    }

    public function getSupplier(): ?Supplier
    {
        return $this->supplier;
    }

    public function setSupplier(?Supplier $supplier): self
    {
        $this->supplier = $supplier;

        return $this;
    }

    public function getCartId(): ?int
    {
        return $this->cartId;
    }

    public function setCartId(int $cartId): self
    {
        $this->cartId = $cartId;

        return $this;
    }

    public function getPayDateTime(): ?\DateTimeInterface
    {
        return $this->PayDateTime;
    }

    public function setPayDateTime(?\DateTimeInterface $PayDateTime): self
    {
        $this->PayDateTime = $PayDateTime;

        return $this;
    }
}
