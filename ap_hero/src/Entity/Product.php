<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ProductRepository")
 * @ApiResource(attributes={
 *   "normalization_context"={"groups"={"product"}}
 * })
 */


 /*
 * @ApiResource(subresourceOperations={
 *     "api_questions_answer_get_subresource"={
 *         "method"="GET",
 *         "normalization_context"={"groups"={"foobar"}}
 *     }
 * })
 */



class Product
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"product", "category", "allergen", "supplier", "variant"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=150)
     * @Groups({"product", "category", "allergen", "supplier", "variant"})
     */
    private $name;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"product", "category", "allergen", "supplier", "variant"})
     */
    private $description;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\Pics", cascade={"persist", "remove"})
     * @Groups({"product", "category", "allergen", "supplier", "variant"})
     * @ApiSubresource
     */
    private $picture;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\Nutritionals", cascade={"persist", "remove"})
     * @Groups({"product", "category", "allergen", "supplier", "variant"})
     * @ApiSubresource
     */
    private $nutritionals;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Category", inversedBy="products")
     * @Groups({"product", "allergen", "supplier", "variant"})
     * @ApiSubresource
     */
    private $category;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Tva")
     * @ApiSubresource
     */
    // @Groups({"product", "category", "allergen", "supplier", "variant"})
    private $tva;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Allergen", inversedBy="products")
     * @Groups({"product", "category", "supplier", "variant"})
     * @ApiSubresource
     */
    private $allergens;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Variant", mappedBy="product", orphanRemoval=true, cascade={"persist"})
     * @Groups({"product", "category", "allergen", "supplier"})
     * @ApiSubresource
     */
    private $variants;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Supplier", inversedBy="products")
     * @Groups({"product", "category", "allergen", "variant"})
     * @ApiSubresource
     */
    private $supplier;

    public function __construct()
    {
        $this->allergens = new ArrayCollection();
        $this->variants = new ArrayCollection();
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

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getPicture(): ?Pics
    {
        return $this->picture;
    }

    public function setPicture(?Pics $picture): self
    {
        $this->picture = $picture;

        return $this;
    }

    public function getNutritionals(): ?Nutritionals
    {
        return $this->nutritionals;
    }

    public function setNutritionals(?Nutritionals $nutritionals): self
    {
        $this->nutritionals = $nutritionals;

        return $this;
    }

    public function getCategory(): ?Category
    {
        return $this->category;
    }

    public function setCategory(?Category $category): self
    {
        $this->category = $category;

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

    /**
     * @return Collection|Allergen[]
     */
    public function getAllergens(): Collection
    {
        return $this->allergens;
    }

    public function addAllergen(Allergen $allergen): self
    {
        if (!$this->allergens->contains($allergen)) {
            $this->allergens[] = $allergen;
        }

        return $this;
    }

    public function removeAllergen(Allergen $allergen): self
    {
        if ($this->allergens->contains($allergen)) {
            $this->allergens->removeElement($allergen);
        }

        return $this;
    }

    /**
     * @return Collection|Variant[]
     */
    public function getVariants(): Collection
    {
        return $this->variants;
    }

    public function addVariant(Variant $variant): self
    {
        if (!$this->variants->contains($variant)) {
            $this->variants[] = $variant;
            $variant->setProduct($this);
        }

        return $this;
    }

    public function removeVariant(Variant $variant): self
    {
        if ($this->variants->contains($variant)) {
            $this->variants->removeElement($variant);
            // set the owning side to null (unless already changed)
            if ($variant->getProduct() === $this) {
                $variant->setProduct(null);
            }
        }

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
}
