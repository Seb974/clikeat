<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;

/**
 * @ORM\Entity(repositoryClass="App\Repository\SupplierRepository")
 * @ApiResource(subresourceOperations={
 *     "api_products_supplier_get_subresource"={
 *         "method"="GET",
 *         "normalization_context"={"groups"={"product"}}
 *     }
 * })
 */
class Supplier
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"product", "supplier", "user"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=120)
     * @Groups({"product", "supplier", "user"})
     */
    private $name;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\User", mappedBy="supplier")
     * @ApiSubresource
     */
    private $users;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Product", mappedBy="supplier")
     * @Groups({"supplier"})
     */
    private $products;

    /**
     * @ORM\Column(type="text")
     */
    private $address;

    /**
     * @ORM\Column(type="time")
     * @Groups({"product", "supplier"})
     */
    private $preparationPeriod;

    public function __construct()
    {
        $this->users = new ArrayCollection();
        $this->products = new ArrayCollection();
    }

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

    /**
     * @return Collection|User[]
     */
    public function getUsers(): Collection
    {
        return $this->users;
    }

    public function addUser(User $user): self
    {
        if (!$this->users->contains($user)) {
            $this->users[] = $user;
            $user->setSupplier($this);
        }

        return $this;
    }

    public function removeUser(User $user): self
    {
        if ($this->users->contains($user)) {
            $this->users->removeElement($user);
            // set the owning side to null (unless already changed)
            if ($user->getSupplier() === $this) {
                $user->setSupplier(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Product[]
     */
    public function getProducts(): Collection
    {
        return $this->products;
    }

    public function addProduct(Product $product): self
    {
        if (!$this->products->contains($product)) {
            $this->products[] = $product;
            $product->setSuppliers($this);
        }

        return $this;
    }

    public function removeProduct(Product $product): self
    {
        if ($this->products->contains($product)) {
            $this->products->removeElement($product);
            // set the owning side to null (unless already changed)
            if ($product->getSuppliers() === $this) {
                $product->setSuppliers(null);
            }
        }

        return $this;
    }

    public function getAddress(): ?string
    {
        return $this->address;
    }

    public function setAddress(string $address): self
    {
        $this->address = $address;

        return $this;
    }

    public function getPreparationPeriod(): ?\DateTimeInterface
    {
        return $this->preparationPeriod;
    }

    public function setPreparationPeriod(\DateTimeInterface $preparationPeriod): self
    {
        $this->preparationPeriod = $preparationPeriod;

        return $this;
    }
}
