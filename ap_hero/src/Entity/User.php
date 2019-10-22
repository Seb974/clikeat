<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 * @UniqueEntity(fields={"email"}, message="There is already an account with this email")
 */
class User implements UserInterface
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"product", "user", "supplier", "variant"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=180, unique=true)
     * @Groups({"product", "user", "supplier", "variant"})
     */
    private $email;

    /**
     * @ORM\Column(type="json")
     * @Groups({"product", "user", "supplier", "variant"})
     */
    private $roles = [];

    /**
     * @var string The hashed password
     * @ORM\Column(type="string")
     */
    private $password;

    /**
     * @ORM\Column(type="string", length=60, nullable=true)
     * @Groups({"product", "user", "supplier", "variant"})
     */
    private $username;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     * @Groups({"product", "user", "supplier", "variant"})
     */
    private $isBanned;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\Pics", cascade={"persist", "remove"})
     */
    private $avatar;

    /*
     * @ORM\OneToOne(targetEntity="App\Entity\Cart", mappedBy="user", orphanRemoval=true)
     * 
     */
    //private $cart;


    /**
     * @ORM\OneToOne(targetEntity="App\Entity\Cart", mappedBy="user", cascade={"persist", "remove"})
     * @Groups({"product", "user", "supplier", "variant"})
     */
    private $cart;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Metadata", mappedBy="user")
     * @Groups({"product", "user", "supplier", "variant"})
     */
    private $metadata;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Supplier", inversedBy="users")
     * @Groups({"product", "user", "variant"})
     */
    private $supplier;

    public function __construct()
    {
        $this->datetime = new ArrayCollection();
        $this->products = new ArrayCollection();
        $this->metadata = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUsername(): string
    {
        return (string) $this->username;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getPassword(): string
    {
        return (string) $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getSalt()
    {
        // not needed when using the "bcrypt" algorithm in security.yaml
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function setUsername(?string $username): self
    {
        $this->username = $username;

        return $this;
    }

    public function getIsBanned(): ?bool
    {
        return $this->isBanned;
    }

    public function setIsBanned(?bool $isBanned): self
    {
        $this->isBanned = $isBanned;

        return $this;
    }

    public function getAvatar(): ?Pics
    {
        return $this->avatar;
    }

    public function setAvatar(?Pics $avatar): self
    {
        $this->avatar = $avatar;

        return $this;
    }

    public function getCart(): ?Cart
    {
        return $this->cart;
    }

    public function setCart(?Cart $cart): self
    {
        $this->cart = $cart;

        // set (or unset) the owning side of the relation if necessary
        $newUser = $cart === null ? null : $this;
        if ($newUser !== $cart->getUser()) {
            $cart->setUser($newUser);
        }

        return $this;
    }

    /**
     * @return Collection|Metadata[]
     */
    public function getMetadata(): Collection
    {
        return $this->metadata;
    }

    public function addMetadata(Metadata $metadata): self
    {
        if (!$this->metadata->contains($metadata)) {
            $this->metadata[] = $metadata;
            $metadata->setUser($this);
        }

        return $this;
    }

    public function removeMetadata(Metadata $metadata): self
    {
        if ($this->metadata->contains($metadata)) {
            $this->metadata->removeElement($metadata);
            // set the owning side to null (unless already changed)
            if ($metadata->getUser() === $this) {
                $metadata->setUser(null);
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
